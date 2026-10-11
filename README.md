# openclaw_workspace

A collection of projects that happens to live under `~/.openclaw/` — **this is not the
agent's workspace directory.** The live agent workspace is `~/.openclaw/workspace`
(a different directory, different inode, different git repo). This one is a project
folder published as `walshie4/walshie4.github.io`, and the name is a long-standing
source of confusion.

If you are looking for `AGENTS.md`, `SOUL.md`, `MEMORY.md`, or the daily `memory/`
notes: they are in `~/.openclaw/workspace`, not here.

## What's here

~30 subdirectories, most of them independent git repos with their own remotes. Not a
monorepo — no shared code, no shared lockfile, no shared CI. Treat each as its own
project and `cd` into it before assuming anything.

Get the real map from git rather than from a list that will go stale:

```bash
for r in */; do [ -d "$r/.git" ] && printf '%-24s %s\n' "$r" \
  "$(git -C "$r" remote get-url origin 2>/dev/null || echo 'no remote')"; done
```

Repos with **no remote** are unbacked-up local work. The nightly job
(`walshie4/openclaw-backups`) snapshots this tree, sanitised, so a lost disk costs
work but not history.

## Rules that apply here

- **Moving things breaks services.** `gather-api.service` runs with
  `WorkingDirectory=/home/walshie/.openclaw/openclaw_workspace/gather/checkin-api`.
  Renaming or moving `gather/` stops a live API. `county-drive.service` points at
  `~/code/county-drive` and is unaffected by anything in this directory.
- `node_modules` recurs across many subdirs. Disk is not the constraint (3.7 TB, ~25 %
  used), but `du -sh */` is worth knowing before a bulk copy.
- When a directory's purpose is unclear, `git log --oneline -5` answers it faster than
  reading files.

## Renaming this directory

Worth doing (`openclaw_projects`?) but it is a coordinated change: the GitHub Pages
repo name, the systemd `WorkingDirectory` above, and any backup-script path all move
together. Not a `mv` and a coffee.

## See also

- Machine restore + model selection: `walshie4/openclaw-backups`, `setup/`
- Docs: <https://docs.openclaw.ai>
