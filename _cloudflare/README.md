# Cloudflare AI mirror for deepclean.au (NOT LIVE)

The Worker that used to be drafted here moved to the shared G'dai Mate project
`~/gdaimate/ai-mirror/` (one Worker, configured per client site). It:

- hands VERIFIED AI agents (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, ChatGPT-User and more)
  the markdown twin of the page they asked for, built from this site at deploy time;
- never changes what Googlebot or Bingbot get;
- logs every hit (human, human-via-AI, which AI bot) for the daily OTS rollup.

What this repo provides for it, and what already works with no Cloudflare at all:

- `_build/build_md.py` + `_build/ai-mirror.json`: run by `_build/stage_site.sh` on every deploy.
  Writes `/md/<page>.md` for every page, adds `<link rel="alternate" type="text/markdown">` to
  each page's head, and lists every twin in `/llms.txt`.
- The deploy workflow checks the twins after staging and fails the deploy if one is missing.
- `robots.txt` keeps `/md/` out of Googlebot and Bingbot.

Go-live steps (GoDaddy nameservers to Cloudflare free plan, DNS records to copy, rollback):
`~/gdaimate/ai-mirror/docs/GO-LIVE-deepclean.md`.
