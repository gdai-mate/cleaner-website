// node _cloudflare/worker.test.mjs  (no deps)
import { shouldServeMarkdown } from './worker.js';
const req = (ua, cat, method = 'GET') => ({ method, headers: new Map([['user-agent', ua]]), cf: cat ? { verifiedBotCategory: cat } : {} });
const cases = [
  ['Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)', 'AI Crawler', true],
  ['Mozilla/5.0 (compatible; OAI-SearchBot/1.0)', 'AI Search', true],
  ['Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', 'AI Crawler', true],
  ['Mozilla/5.0 (compatible; PerplexityBot/1.0)', 'AI Search', true],
  ['Mozilla/5.0 (compatible; GPTBot/1.2)', '', false],                       // spoofed, not verified
  ['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'Search Engine Crawler', false],
  ['Mozilla/5.0 (compatible; bingbot/2.0)', 'Search Engine Crawler', false],
  ['Mozilla/5.0 (compatible; Googlebot/2.1) GPTBot', 'AI Crawler', false],   // anything Google-ish stays normal
  ['Mozilla/5.0 (iPhone) Safari', '', false],
  ['Mozilla/5.0 (compatible; GPTBot/1.2)', 'AI Crawler', false, 'POST'],
];
let fail = 0;
for (const [ua, cat, want, m] of cases) {
  const r = req(ua, cat, m);
  r.headers.get = r.headers.get.bind(r.headers);
  const got = shouldServeMarkdown(r);
  if (got !== want) { fail++; console.log('FAIL', ua, cat, got); }
}
console.log(fail ? `${fail} failed` : `all ${cases.length} passed`);
process.exit(fail ? 1 : 0);
