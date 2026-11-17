# AI-crawler markdown worker (NOT LIVE)

`worker.js` hands verified AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) a plain
markdown copy of the page they asked for. Googlebot, Bingbot and every human get the normal site.
The markdown copies are built from the human pages on every deploy (`_build/build_md.py`, run by
`_build/stage_site.sh`), so they always say the same thing as the page. They also live at
`https://deepclean.au/md/<page>.md` and are linked from `/llms.txt`, which works today with no Cloudflare at all.

Verification is Cloudflare's own `request.cf.verifiedBotCategory` (set only for bots Cloudflare has
confirmed by IP and reverse DNS, available on the free plan). A spoofed "GPTBot" user agent gets the normal page.

Test the rules: `node _cloudflare/worker.test.mjs`

## Why it isn't live

deepclean.au's DNS sits at GoDaddy (nameservers `ns09/ns10.domaincontrol.com`, checked 17 Nov 2026).
Workers only run on domains whose DNS is on Cloudflare. Moving the nameservers is a change to
Amie's domain, so it needs Asgard's AND Amie's OK first. The site, email and Search Console all
keep working through the move if the records below are copied exactly.

## Steps (once both say yes)

1. Cloudflare dashboard (free plan is enough) > Add a domain > `deepclean.au` > Free.
2. Check the imported DNS records match what's live now, and add any that are missing:
   - `A  deepclean.au  185.199.108.153`, `.109.153`, `.110.153`, `.111.153` (GitHub Pages)
   - `CNAME www  deepclean.au` (or `gdai-mate.github.io`)
   - `TXT deepclean.au  google-site-verification=5zdRXLmAFDqE-rXRCaJ2t3R6zrXLaXmyO39QEkxfbOs` (Search Console, do NOT drop this)
   - No MX records exist today (Amie uses Gmail), so there is no email to break. Re-check in GoDaddy before switching anyway.
3. Proxy status: orange cloud on the A and www records. SSL/TLS mode: **Full** (not Flexible, which loops; not Full strict until GitHub's cert is confirmed fine).
4. In GoDaddy (Amie's login, or she adds Asgard as a delegate): Domain > Nameservers > Change > enter the two Cloudflare nameservers. .au changes usually land within a few hours.
5. When Cloudflare says Active: `cd _cloudflare && npx wrangler login && npx wrangler deploy`. Routes are in `wrangler.toml`.
6. Check: `curl -sI https://deepclean.au/` (normal HTML), and in Cloudflare > Security > Events confirm GPTBot / ClaudeBot hits show `x-deepclean-variant: markdown` in Workers logs. A curl with a GPTBot user agent will (correctly) get HTML, because curl isn't verified.
7. Leave Security > Bots > "Block AI bots" OFF and AI Crawl Control on allow for these four, or the worker never sees them.

**Gotcha:** GitHub Pages renews its HTTPS cert with an HTTP challenge. Behind the orange cloud that can fail at renewal time. If GitHub Pages settings ever show a cert error, grey-cloud the records for an hour, let it renew, then turn the proxy back on.

## Rollback

Delete the worker route in Cloudflare (instant), or point the nameservers back to `ns09.domaincontrol.com` / `ns10.domaincontrol.com` in GoDaddy.
