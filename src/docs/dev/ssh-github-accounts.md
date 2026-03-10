# SSH Multi-Account Setup (GitHub)

Use this guide when one machine has multiple GitHub identities (for example `signetai` and `shengliangsong-ai`).

## 1. Generate or Locate Keys

```bash
ls -la ~/.ssh
# expected examples:
# id_ed25519_signetai
# id_ed25519_sheng
```

If missing, generate:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_sheng
```

## 2. Add Keys to Agent

```bash
ssh-add ~/.ssh/id_ed25519_sheng
ssh-add ~/.ssh/id_ed25519_signetai
ssh-add -l
```

## 3. Configure SSH Host Aliases

Edit `~/.ssh/config`:

```sshconfig
Host github-sheng
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_sheng
  IdentitiesOnly yes

Host github-signet
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_signetai
  IdentitiesOnly yes
```

Set permissions:

```bash
chmod 600 ~/.ssh/config
```

## 4. Verify Each Account

```bash
ssh -T git@github-sheng
# Hi shengliangsong-ai! ...

ssh -T git@github-signet
# Hi signetai! ...
```

## 5. Point Repo Remote to Correct Alias

For this repo:

```bash
git remote set-url origin git@github-sheng:shengliangsong-ai/signetai.git
git remote -v
```

Push:

```bash
git push origin main
```

## 6. Common Errors

### "Could not resolve hostname github-sheng"
- `~/.ssh/config` missing host alias or typo.

### "Permission denied to <repo>"
- Wrong SSH key/account selected for that repo.
- Confirm with `ssh -T git@github-sheng`.

### "Could not read from remote repository"
- Repo permission missing or wrong remote URL.

---

For Signet contributors, keep account-specific remotes explicit to avoid accidental pushes under the wrong identity.
