/**
 * deepclean.au AI-crawler worker. NOT LIVE. Needs deepclean.au on Cloudflare first (see README.md).
 *
 * Verified AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) asking for a page get the
 * plain markdown copy of that same page (/md/<page>.md, built from the human page at deploy time by
 * _build/build_md.py). Everyone else, including Googlebot and Bingbot, gets the normal site untouched.
 *
 * "Verified" means Cloudflare checked it: request.cf.verifiedBotCategory is only set for bots whose
 * IPs / reverse DNS Cloudflare has confirmed, on every plan. A user agent alone is never enough,
 * anyone can type "GPTBot" into a header.
 */

const AI_BOTS = [/\bGPTBot\b/i, /\bOAI-SearchBot\b/i, /\bClaudeBot\b/i, /\bPerplexityBot\b/i];
const SEARCH_ENGINES = /Googlebot|Google-InspectionTool|AdsBot-Google|bingbot|BingPreview|msnbot/i;
const AI_CATEGORIES = new Set(['AI Crawler', 'AI Search', 'AI Assistant']);

// Pages that have a markdown copy. "/" is the homepage.
function mdPathFor(pathname) {
  if (pathname === '/' || pathname === '/index.html') return '/md/index.md';
  const m = pathname.match(/^\/([a-z0-9-]+)(?:\.html)?$/);
  return m ? `/md/${m[1]}.md` : null;
}

export function shouldServeMarkdown(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  const ua = request.headers.get('user-agent') || '';
  if (SEARCH_ENGINES.test(ua)) return false;                 // never change what search engines see
  if (!AI_BOTS.some((re) => re.test(ua))) return false;
  const category = (request.cf && request.cf.verifiedBotCategory) || '';
  return AI_CATEGORIES.has(category);                         // spoofed UAs have no category
}

export default {
  async fetch(request, env, ctx) {
    if (!shouldServeMarkdown(request)) return fetch(request);

    const url = new URL(request.url);
    const md = mdPathFor(url.pathname);
    if (!md) return fetch(request);

    const mdUrl = new URL(md, url.origin);
    const res = await fetch(mdUrl.toString(), { cf: { cacheTtl: 3600, cacheEverything: true } });
    if (!res.ok) return fetch(request);                       // no copy for this page: normal page

    const headers = new Headers(res.headers);
    headers.set('content-type', 'text/markdown; charset=utf-8');
    headers.set('link', `<${url.origin}${url.pathname}>; rel="canonical"`);
    headers.set('x-robots-tag', 'noindex');
    headers.set('vary', 'User-Agent');
    headers.set('x-deepclean-variant', 'markdown');
    return new Response(request.method === 'HEAD' ? null : res.body, { status: 200, headers });
  },
};
