#!/usr/bin/env python3
# Vendored from ~/gdaimate/ai-mirror/build/build_md.py. Edit there, then copy here.
"""AI mirror build step. Turns a site's built HTML into markdown twins, one per page.

    python3 -I build_md.py <site_dir> --config ai-mirror.json [--check]

For every page in <site_dir> (top level and subfolders, minus `exclude` globs) it:
  1. writes <site_dir>/<md_dir>/<page>.md, made FROM that page, so it only ever says what the
     page says (same facts, no extra keywords);
  2. adds <link rel="alternate" type="text/markdown" href="/md/<page>.md"> to the page's <head>
     (skipped if the page already has one, so re-running changes nothing);
  3. rewrites the block between `<!-- ai-mirror:start -->` and `<!-- ai-mirror:end -->` in
     llms.txt with a list of every twin (appended at the end if the markers aren't there).

--check writes nothing and exits 1 if any page is missing its link tag or llms.txt is stale
(handy in CI). Stdlib only, so it runs in GitHub Actions with no install. This file is the
canonical copy in ~/gdaimate/ai-mirror/build/; each site repo carries a vendored copy.
"""
import argparse
import fnmatch
import html
import json
import os
import re
import sys
from html.parser import HTMLParser

DEFAULT_SKIP_TAGS = {"script", "style", "noscript", "svg", "form", "button", "select", "textarea",
                     "template", "iframe", "nav", "video", "audio", "canvas", "dialog"}
VOID = {"br", "img", "hr", "input", "meta", "link", "source", "wbr", "area", "base", "col", "embed", "track"}
BLOCK = {"p", "div", "section", "article", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figure",
         "figcaption", "details", "summary", "tr", "ul", "ol", "table", "main", "footer", "header", "aside", "dl", "dt", "dd"}
START, END = "<!-- ai-mirror:start -->", "<!-- ai-mirror:end -->"


class ToMd(HTMLParser):
    def __init__(self, cfg):
        super().__init__(convert_charrefs=True)
        self.site = cfg["site_url"].rstrip("/")
        self.roots = set(cfg.get("roots", ["main", "footer"]))
        self.skip_classes = set(cfg.get("skip_classes", []))
        self.skip_ids = set(cfg.get("skip_ids", []))
        self.skip_tags = DEFAULT_SKIP_TAGS | set(cfg.get("skip_tags", []))
        # {"faq-q": 3}: an element with this class becomes a level-3 heading, even a <button>
        self.heading_classes = cfg.get("heading_classes", {})
        # {"h1-kw": ": "}: text emitted after this element closes (keeps run-together words apart)
        self.after_classes = cfg.get("after_classes", {})
        self.out, self.stack = [], []
        self.skip = 0
        self.in_root = 0
        self.href, self.link_text = None, []
        self.title, self.desc, self.in_title = "", "", False

    def _heading(self, a):
        for c in (a.get("class") or "").split():
            if c in self.heading_classes:
                return int(self.heading_classes[c])
        return 0

    def _after(self, a):
        return "".join(self.after_classes.get(c, "") for c in (a.get("class") or "").split())

    def _skipping(self, tag, a):
        cls = set((a.get("class") or "").split())
        if self._heading(a):
            return False
        return (tag in self.skip_tags or bool(cls & self.skip_classes) or a.get("id") in self.skip_ids
                or a.get("aria-hidden") == "true" or "hidden" in a)

    def emit(self, s):
        if self.skip or not self.in_root:
            return
        (self.link_text if self.href is not None else self.out).append(s)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.desc = a.get("content", "")
        if tag in VOID:
            if tag == "br":
                self.emit("\n")
            return
        skipping = self._skipping(tag, a)
        level = 0 if skipping else self._heading(a)
        after = "" if skipping else self._after(a)
        if level:
            after = "\n\n" + after
        self.stack.append((tag, skipping, after))
        if skipping:
            self.skip += 1
            return
        if level:
            self.emit("\n\n" + "#" * level + " ")
        if tag in self.roots:
            self.in_root += 1
        if tag in BLOCK:
            self.emit("\n\n")
        if re.fullmatch(r"h[1-6]", tag):
            self.emit("#" * int(tag[1]) + " ")
        elif tag == "li":
            self.emit("- ")
        elif tag == "blockquote":
            self.emit("> ")
        elif tag in ("strong", "b", "summary", "dt"):
            self.emit("**")
        elif tag in ("td", "th"):
            self.emit(" | ")
        elif tag == "span":
            self.emit(" ")  # sibling spans (card titles, captions) keep their words apart
        elif tag == "a" and self.in_root and not self.skip:
            href = a.get("href", "")
            if href and not href.startswith(("#", "javascript:")):
                if not re.match(r"^(https?:|tel:|mailto:)", href):
                    href = f"{self.site}/{href.lstrip('./').lstrip('/')}"
                self.href, self.link_text = href, []

    def _close_link(self):
        if self.href is None:
            return
        raw = "".join(self.link_text)
        href, self.href = self.href, None
        if "\n" in raw.strip() or raw.lstrip().startswith("#"):
            self.emit(raw.rstrip() + f"\n\n[Open this page]({href})\n\n")  # a whole card was the link
            return
        text = re.sub(r"\s+", " ", raw).strip()
        if text:
            self.emit(f"[{text}]({href})")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in VOID:
            return
        if not any(e[0] == tag for e in self.stack):
            return  # stray close tag
        while self.stack:  # pop to the matching tag, tolerating sloppy markup
            t, skipping, after = self.stack.pop()
            if after and not skipping:
                self.emit(after)
            if skipping:
                self.skip -= 1
            elif t in self.roots:
                self.in_root -= 1
            if t == "a" and tag != "a":
                self._close_link()  # an <a> closed implicitly by its parent: don't swallow the page
            if t == tag:
                break
        if self.skip:
            return
        if tag == "a":
            self._close_link()
        elif tag in ("strong", "b", "summary", "dt"):
            self.emit("**")
        if tag in BLOCK:
            self.emit("\n\n")

    def handle_data(self, data):
        if self.in_title:
            self.title += data
            return
        self.emit(re.sub(r"\s+", " ", data))


def page_url(site, rel):
    if rel == "index.html":
        return site + "/"
    if rel.endswith("/index.html"):
        return f"{site}/{rel[:-10]}"
    return f"{site}/{rel}"


def md_rel(rel):
    return rel[:-5] + ".md"


def convert(src, rel, cfg):
    p = ToMd(cfg)
    p.feed(src)
    body = "".join(p.out)
    body = re.sub(r"\*\*\s*\*\*", "", body)
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n[ \t]+", "\n", body)
    body = re.sub(r" {2,}", " ", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    title = html.unescape(p.title).strip()
    head = f"# {title}\n\n"
    if p.desc:
        head += f"> {html.unescape(p.desc).strip()}\n\n"
    head += f"Page: {page_url(cfg['site_url'].rstrip('/'), rel)}\n"
    if cfg.get("contact"):
        head += cfg["contact"] + "\n"
    head += "\n---\n\n"
    return title, head + body + "\n"


def link_tag(cfg, rel):
    return (f'<link rel="alternate" type="text/markdown" href="/{cfg.get("md_dir", "md")}/{md_rel(rel)}" '
            f'title="Plain markdown copy of this page">')


def inject(src, tag):
    if 'type="text/markdown"' in src:
        return src
    m = re.search(r"</head\s*>", src, re.I)
    if not m:
        return src
    return src[:m.start()] + tag + "\n" + src[m.start():]


def llms_block(cfg, pages):
    site = cfg["site_url"].rstrip("/")
    md_dir = cfg.get("md_dir", "md")
    lines = [START, "", "## Markdown copies of every page", "",
             cfg.get("llms_intro", "Each page on this site has a plain markdown copy with the same content, for AI assistants."), ""]
    for rel, title in pages:
        lines.append(f"- [{title or rel}]({site}/{md_dir}/{md_rel(rel)})")
    lines += ["", END]
    return "\n".join(lines)


def update_llms(text, block):
    if START in text and END in text:
        return text[:text.index(START)] + block + text[text.index(END) + len(END):]
    return text.rstrip("\n") + "\n\n" + block + "\n"


def pages_in(site_dir, cfg):
    md_dir = cfg.get("md_dir", "md")
    excl = cfg.get("exclude", [])
    for root, dirs, files in os.walk(site_dir):
        dirs[:] = sorted(d for d in dirs if not d.startswith((".", "_")) and d not in (md_dir, "node_modules", "assets"))
        for f in sorted(files):
            if not f.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(root, f), site_dir).replace(os.sep, "/")
            if any(fnmatch.fnmatch(rel, g) for g in excl):
                continue
            yield rel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("site_dir")
    ap.add_argument("--config", required=True)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    cfg = json.load(open(args.config, encoding="utf-8"))
    site_dir = args.site_dir
    md_root = os.path.join(site_dir, cfg.get("md_dir", "md"))
    done, stale = [], []
    for rel in pages_in(site_dir, cfg):
        path = os.path.join(site_dir, rel)
        src = open(path, encoding="utf-8").read()
        title, md = convert(src, rel, cfg)
        done.append((rel, title))
        if cfg.get("inject_links", True):
            new = inject(src, link_tag(cfg, rel))
            if new != src:
                stale.append(rel)
                if not args.check:
                    open(path, "w", encoding="utf-8").write(new)
        if not args.check:
            out = os.path.join(md_root, md_rel(rel))
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, "w", encoding="utf-8").write(md)
    llms = cfg.get("llms")
    if llms:
        lp = os.path.join(site_dir, llms)
        if os.path.exists(lp):
            text = open(lp, encoding="utf-8").read()
            new = update_llms(text, llms_block(cfg, done))
            if new != text:
                stale.append(llms)
                if not args.check:
                    open(lp, "w", encoding="utf-8").write(new)
    if args.check:
        print("ai-mirror check: " + ("stale: " + ", ".join(stale) if stale else f"ok, {len(done)} pages"))
        sys.exit(1 if stale else 0)
    print(f"ai-mirror: {len(done)} markdown twins -> {md_root}" + (f", updated {len(stale)} files" if stale else ""))


if __name__ == "__main__":
    main()
