const functions = require("firebase-functions");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const ffmpeg = require("ffmpeg-static");

exports.extractDriveFrames = functions.runWith({
  timeoutSeconds: 60,
  memory: '1GB'
}).https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  try {
    const fileId = req.query.fileId || '';
    const key = req.query.key || '';
    const tsRaw = req.query.timestamps || '';
    const timestamps = tsRaw
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n >= 0)
      .slice(0, 120);

    if (!fileId || !key || timestamps.length === 0) {
      res.status(400).json({ error: 'Missing fileId/key/timestamps' });
      return;
    }

    const inputUrls = [
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${key}`,
      `https://drive.google.com/uc?export=download&id=${fileId}`
    ];

    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'signet-drive-frames-'));
    const results = [];
    const diagnostics = {
      requestedCount: timestamps.length,
      extractedCount: 0,
      attempts: []
    };

    const tryUrl = async (inputUrl) => {
      const current = [];
      const failed = [];
      let sampleError = '';
      const startedAt = Date.now();
      const OVERALL_DEADLINE_MS = 20000;
      for (const ts of timestamps) {
        if (Date.now() - startedAt > OVERALL_DEADLINE_MS) {
          failed.push(ts);
          if (!sampleError) sampleError = 'server_deadline_exceeded';
          continue;
        }
        const out = path.join(tmpRoot, `frame_${ts}.jpg`);
        const cmd = spawnSync(
          ffmpeg,
          ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-ss', String(ts), '-i', inputUrl, '-frames:v', '1', '-q:v', '3', out],
          { encoding: 'utf8', timeout: 3500, maxBuffer: 1024 * 1024 * 2 }
        );
        if (cmd.status !== 0) {
          failed.push(ts);
          if (!sampleError) {
            const timeoutErr = (cmd.error && cmd.error.code === 'ETIMEDOUT') ? 'ffmpeg_timeout' : '';
            sampleError = timeoutErr || String(cmd.stderr || cmd.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean)[0] || 'ffmpeg_error';
          }
          continue;
        }
        try {
          const bin = await fs.readFile(out);
          current.push({ timestamp: ts, imageUrl: `data:image/jpeg;base64,${bin.toString('base64')}` });
        } catch (e) {
          failed.push(ts);
        }
      }
      diagnostics.attempts.push({
        urlBase: inputUrl.split('?')[0],
        extractedTimestamps: current.map((f) => f.timestamp),
        failedTimestamps: failed,
        sampleError: sampleError || undefined
      });
      return current;
    };

    for (const inputUrl of inputUrls) {
      const frames = await tryUrl(inputUrl);
      if (frames.length > 0) {
        results.push(...frames);
        break;
      }
    }

    await fs.rm(tmpRoot, { recursive: true, force: true });
    diagnostics.extractedCount = results.length;
    diagnostics.extractedTimestamps = results.map((f) => f.timestamp);
    diagnostics.missingTimestamps = timestamps.filter((ts) => !results.some((r) => r.timestamp === ts));

    res.status(200).json({ frames: results, diagnostics });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'extractor_error' });
  }
});
