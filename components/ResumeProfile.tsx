import React, { useState, useEffect } from 'react';

const RESUME_DATA = {
  name: "Sheng-Liang Song",
  email: "shengliang.song@gmail.com",
  phone: "(510) 766-9107",
  location: "Fremont, CA, US",
  summary: "A highly experienced software engineer and technical leader with over 20+ years of C++ experience designing, developing, and launching innovative software products. Strong expertise in computer architecture, embedded systems, distributed storage, cloud compute-storage separation database, and serverless database within a Kubernetes cluster.",
  skills: ['C/C++', 'SystemC', 'Architectural Modeling', 'Embedded Systems', 'DDR', 'SSD', 'Storage Systems', 'Database', 'Kubernetes (k8s)'],
  experience: [
    { title: "Senior Software Engineer", company: "Meta", location: "Burlingame, CA", date: "Jan 2025 - Dec 2025" },
    { title: "Senior Software Engineer", company: "TikTok", location: "San Jose, CA", date: "May 2022 - Dec 2024" },
    { title: "Senior Software Engineer", company: "Microsoft", location: "Mountain View, CA", date: "Jan 2020 - Mar 2022" },
    { title: "Aurora Software Engineer", company: "Amazon", location: "East Palo Alto, CA", date: "Dec 2016 - Jan 2020" },
    { title: "Lecturer", company: "SJSU", location: "San Jose, CA", date: "Dec 2016 - Aug 2018" },
    { title: "Senior Software Engineer", company: "Google", location: "Mountain View, CA", date: "Mar 2014 - Jun 2016" },
    { title: "Sr. Staff Software Engineer", company: "Broadcom Corporation", location: "Santa Clara, CA", date: "May 2011 - Nov 2013" },
    { title: "Sr. Staff Firmware Engineer", company: "LinkAMedia Devices", location: "Santa Clara, CA", date: "Oct 2009 - May 2011" },
    { title: "Sr. Architectural Modeling", company: "Bay Microsystems Inc", location: "San Jose, CA", date: "Jul 2006 - Oct 2009" },
    { title: "Diagnostic Software Engineer", company: "Cisco Systems Inc.", location: "San Jose, CA", date: "May 2000 - Jul 2006" }
  ],
  education: [
    { degree: "Master of Computer Science", school: "San Jose State University", date: "2005 - 2008" },
    { degree: "Electrical Engineering and Computer Science, BS", school: "UC Berkeley", date: "1998 - 2000" },
    { degree: "Computer Science, AS", school: "Santa Rosa Junior College", date: "1995 - 1998" }
  ]
};

export const ResumeProfile: React.FC = () => {
  const [publicKeyJwk, setPublicKeyJwk] = useState<JsonWebKey | null>(null);
  const [signatureHex, setSignatureHex] = useState<string | null>(null);

  const [verifyKeyFile, setVerifyKeyFile] = useState<File | null>(null);
  const [verifyResumeFile, setVerifyResumeFile] = useState<File | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'failed' | 'error'>('idle');

  useEffect(() => {
    const initCrypto = async () => {
      try {
        // 1. Generate KeyPair
        const kp = await window.crypto.subtle.generateKey(
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          true, // extractable
          ["sign", "verify"]
        );

        // 2. Export Public Key
        const jwk = await window.crypto.subtle.exportKey("jwk", kp.publicKey);
        setPublicKeyJwk(jwk);

        // 3. Sign Resume Data
        const encoder = new TextEncoder();
        const dataToSign = encoder.encode(JSON.stringify(RESUME_DATA));
        const signatureBuffer = await window.crypto.subtle.sign(
          {
            name: "ECDSA",
            hash: { name: "SHA-256" },
          },
          kp.privateKey,
          dataToSign
        );
        
        const sigArray = Array.from(new Uint8Array(signatureBuffer));
        const sigHex = sigArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setSignatureHex(sigHex);
      } catch (e) {
        console.error("Crypto init failed", e);
      }
    };
    initCrypto();
  }, []);

  const handleDownloadPublicKey = () => {
    if (!publicKeyJwk) return;
    const blob = new Blob([JSON.stringify(publicKeyJwk, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shengliang_public_key.jwk.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSignedResume = () => {
    if (!signatureHex) return;
    const signedPayload = {
      data: RESUME_DATA,
      signature: signatureHex,
      algorithm: "ECDSA P-256 SHA-256"
    };
    const blob = new Blob([JSON.stringify(signedPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shengliang_signed_resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = async () => {
    if (!verifyKeyFile || !verifyResumeFile) return;
    
    try {
      const keyText = await verifyKeyFile.text();
      const resumeText = await verifyResumeFile.text();
      
      const jwk = JSON.parse(keyText);
      const signedPayload = JSON.parse(resumeText);
      
      const pubKey = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["verify"]
      );
      
      const sigHex = signedPayload.signature;
      const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));
      
      const encoder = new TextEncoder();
      const dataToVerify = encoder.encode(JSON.stringify(signedPayload.data));
      
      const isValid = await window.crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: { name: "SHA-256" },
        },
        pubKey,
        sigBytes,
        dataToVerify
      );
      
      setVerifyStatus(isValid ? 'success' : 'failed');
    } catch (e) {
      console.error(e);
      setVerifyStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12 border-b border-[var(--border-light)] pb-8">
        <h1 className="text-4xl font-bold text-[var(--text-header)] mb-2">Sheng-Liang Song</h1>
        <div className="text-[var(--text-body)] opacity-80 flex flex-wrap gap-4 text-sm font-mono mt-4">
          <span>📍 Fremont, CA, US</span>
          <span>✉️ shengliang.song@gmail.com</span>
          <span>📱 (510) 766-9107</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-[var(--text-header)] uppercase tracking-widest mb-6 border-l-4 border-[var(--trust-blue)] pl-4">Summary</h2>
        <p className="text-[var(--text-body)] leading-relaxed">
          A highly experienced software engineer and technical leader with over 20+ years of C++ experience designing, developing, and launching innovative software products. Strong expertise in computer architecture, embedded systems, distributed storage, cloud compute-storage separation database, and serverless database within a Kubernetes cluster.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-[var(--text-header)] uppercase tracking-widest mb-6 border-l-4 border-[var(--trust-blue)] pl-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['C/C++', 'SystemC', 'Architectural Modeling', 'Embedded Systems', 'DDR', 'SSD', 'Storage Systems', 'Database', 'Kubernetes (k8s)'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-full text-sm font-mono text-[var(--text-body)]">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-[var(--text-header)] uppercase tracking-widest mb-6 border-l-4 border-[var(--trust-blue)] pl-4">Experience</h2>
        
        <div className="space-y-10">
          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--trust-blue)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Senior Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Jan 2025 - Dec 2025</span>
            </div>
            <div className="text-[var(--trust-blue)] font-medium mb-4">Meta • Burlingame, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Designed and implemented a memory management component for the embedded Connectivity Framework, optimizing memory footprint and performance across multiple device profiles.</li>
              <li>Developed the Stream file transfer service over the DataX transport layer for AR/VR devices, enabling efficient and reliable coredump uploads and OTA software updates.</li>
              <li>Implemented Constellation Profile Arbitration, supporting Hands-Free Profile integration for seamless Bluetooth coexistence and user experience.</li>
              <li>Hackathon: Co-created LectureMate, an AI-driven podcast agent integrated with Metamate and Deep Research, built in just 3 days as part of a two-person team.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Senior Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">May 2022 - Dec 2024</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">TikTok • San Jose, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Led the design and development of DDL query execution in a MySQL cluster with N-shard writers, improving distributed schema change reliability and scalability.</li>
              <li>Implemented a proof-of-concept for distributed query processing, demonstrating performance gains for cross-shard analytics and laying groundwork for future federated query capabilities.</li>
              <li>Designed and implemented adaptive autoscaling for buffer pool and heap memory, extending beyond CPU-based scaling to optimize resource utilization and reduce latency under dynamic workloads.</li>
              <li>Built a continuous code coverage pipeline that generated daily reports, increasing test visibility and improving regression detection efficiency.</li>
              <li>Authored the "ByteNDB Compile & Run Cookbook," standardizing internal build workflows and accelerating onboarding for new engineers.</li>
              <li>Mentored interns and led technical interviews, contributing to talent development and building a high-performing, collaborative engineering culture.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Senior Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Jan 2020 - Mar 2022</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Microsoft • Mountain View, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Implemented asynchronous DDL physical replication within a replica group for MySQL8, resulting in improved replication speed and overall user experience. Reduced replication lag and improved system performance.</li>
              <li>Participated in on-call support for Azure databases, including MySQL and PostgreSQL products, ensuring timely and effective resolution of customer issues. Increased collaboration across teams, improved customer satisfaction, and enhanced technical proficiency.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Aurora Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Dec 2016 - Jan 2020</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Amazon • East Palo Alto, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Trained Primary-On-Call engineers on DDL Recovery and MySQL Metadata Lock issues through hands-on exercises, enhancing their technical proficiency and enabling them to effectively handle complex issues. Reduced resolution time for DDL Recovery and Metadata Lock issues.</li>
              <li>Contributed to various projects including Aurora Fast DDL features, Porting from MySQL 5.6 to 5.7, Parallel-Query processing, and multi-master DDL features, improving product functionality and enabling better user experience. Increased customer satisfaction and improved product quality.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Lecturer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Dec 2016 - Aug 2018</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">SJSU • San Jose, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Taught CMPE 200 Computer Architecture for 3 semesters: Spring 2017, Fall 2017, and Spring 2018</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Senior Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Mar 2014 - Jun 2016</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Google • Mountain View, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Designed and implemented battery firmware over-the-air update for Chromebook, resulting in significant cost savings by avoiding the need to ship Chromebooks back for manual fixes.</li>
              <li>Conducted over 200 interviews and served on the Hire Committee, playing a key role in hiring top talent for the company. Helped streamline the recruitment process, resulting in faster hiring and increased candidate satisfaction (61 days).</li>
              <li>Taught interviewer training classes to 400+ googlers which enhanced interviewing skills and ensured a consistent hiring process across teams. Taught a firmware class to 200+ googlers in the g2g program, sharing knowledge across the organizations.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Sr. Staff Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">May 2011 - Nov 2013</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Broadcom Corporation • Santa Clara, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Improved DDR3 memory controller frequency from 666MHz to 800MHz through implementing Read Training and Write Leveling.</li>
              <li>Collaborated with a team of 10+ engineers to bring up XLPII multicore processors.</li>
              <li>Conducted openocd/gdb debug training sessions for 15 RTL verification and software team members.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Sr. Staff Firmware Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Oct 2009 - May 2011</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">LinkAMedia Devices • Santa Clara, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Led the end-to-end Hybrid HDD Firmware Project and integrated Toshiba Host interface API from the design phase to SoC bring-up within a timeline of 6 months. Delivered the firmware on schedule and met project objectives.</li>
              <li>Developed NAND Flash Management and SSD failure analysis components that improved the overall system reliability and facilitated root cause analysis.</li>
              <li>Collaborated effectively with cross-functional teams to resolve PCIe Gen2 Physical link retrain issues, resulting in improved system performance and stability.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Sr. Architectural Modeling</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">Jul 2006 - Oct 2009</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Bay Microsystems Inc • San Jose, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Designed ODU Overhead termination and generation and OTN FEC model in SystemC.</li>
              <li>Developed sample Linux network applications with programmable network processors.</li>
            </ul>
          </div>

          <div className="relative pl-6 border-l border-[var(--border-light)]">
            <div className="absolute w-3 h-3 bg-[var(--border-light)] rounded-full -left-[6.5px] top-1.5"></div>
            <div className="flex flex-wrap justify-between items-baseline mb-2">
              <h3 className="text-lg font-bold text-[var(--text-header)]">Diagnostic Software Engineer</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">May 2000 - Jul 2006</span>
            </div>
            <div className="text-[var(--text-header)] font-medium mb-4">Cisco Systems Inc. • San Jose, CA</div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-[var(--text-body)] opacity-90">
              <li>Brought up one Cat6K and 7600 family line card: Embedded Logic Analyzer, Channelized OC12, PowerPC MPC8548, and EZchip, and Shared Port Adapters.</li>
              <li>Trained manufacturing partners to isolate component level failures to improve yields.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--text-header)] uppercase tracking-widest mb-6 border-l-4 border-[var(--trust-blue)] pl-4">Education</h2>
        
        <div className="space-y-6">
          <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-baseline mb-1">
              <h3 className="font-bold text-[var(--text-header)]">Master of Computer Science</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">2005 - 2008</span>
            </div>
            <div className="text-[var(--text-body)] opacity-90">San Jose State University • San Jose, CA</div>
            <div className="text-xs text-[var(--text-body)] opacity-60 mt-1 italic">(While working full-time)</div>
          </div>

          <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-baseline mb-1">
              <h3 className="font-bold text-[var(--text-header)]">Electrical Engineering and Computer Science, BS</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">1998 - 2000</span>
            </div>
            <div className="text-[var(--text-body)] opacity-90">UC Berkeley • Berkeley, CA</div>
          </div>

          <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-baseline mb-1">
              <h3 className="font-bold text-[var(--text-header)]">Computer Science, AS</h3>
              <span className="text-sm font-mono text-[var(--text-body)] opacity-70">1995 - 1998</span>
            </div>
            <div className="text-[var(--text-body)] opacity-90">Santa Rosa Junior College</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--text-header)] uppercase tracking-widest mb-6 border-l-4 border-[var(--trust-blue)] pl-4">Cryptographic Identity & Verification</h2>
        
        <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-6 rounded-xl mb-8">
          <h3 className="font-bold text-[var(--text-header)] mb-2">1. Download Signed Resume & Public Key</h3>
          <p className="text-sm text-[var(--text-body)] opacity-80 mb-6">
            My resume is cryptographically signed using an ECDSA P-256 private key. You can download the signed JSON payload and my public key to verify its authenticity.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleDownloadSignedResume}
              disabled={!signatureHex}
              className="px-4 py-2 bg-[var(--trust-blue)] text-white text-sm font-bold rounded hover:brightness-110 transition-all disabled:opacity-50"
            >
              Download Signed Resume (JSON)
            </button>
            <button 
              onClick={handleDownloadPublicKey}
              disabled={!publicKeyJwk}
              className="px-4 py-2 bg-transparent border border-[var(--trust-blue)] text-[var(--trust-blue)] text-sm font-bold rounded hover:bg-[var(--trust-blue)] hover:text-white transition-all disabled:opacity-50"
            >
              Download Public Key (JWK)
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-sidebar)] border border-[var(--border-light)] p-6 rounded-xl">
          <h3 className="font-bold text-[var(--text-header)] mb-2">2. Verify Signature Demo</h3>
          <p className="text-sm text-[var(--text-body)] opacity-80 mb-6">
            Upload the downloaded public key and signed resume to verify the cryptographic signature locally in your browser.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-body)] opacity-60 mb-2">Public Key (JWK)</label>
              <input 
                type="file" 
                accept=".json"
                onChange={(e) => setVerifyKeyFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[var(--text-body)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[var(--border-light)] file:text-[var(--text-header)] hover:file:bg-opacity-80"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-body)] opacity-60 mb-2">Signed Resume (JSON)</label>
              <input 
                type="file" 
                accept=".json"
                onChange={(e) => setVerifyResumeFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[var(--text-body)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[var(--border-light)] file:text-[var(--text-header)] hover:file:bg-opacity-80"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleVerify}
              disabled={!verifyKeyFile || !verifyResumeFile}
              className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-all disabled:opacity-50"
            >
              Verify Signature
            </button>
            
            {verifyStatus === 'success' && (
              <span className="text-green-500 font-bold flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Signature Valid
              </span>
            )}
            {verifyStatus === 'failed' && (
              <span className="text-red-500 font-bold flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Signature Invalid
              </span>
            )}
            {verifyStatus === 'error' && (
              <span className="text-orange-500 font-bold flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Verification Error
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
