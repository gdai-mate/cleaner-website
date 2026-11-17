#!/usr/bin/env python3
"""Write a plain markdown copy of every staged page to <site>/md/<page>.md.

These are what the Cloudflare Worker (_cloudflare/) hands to verified AI crawlers, and what
/llms.txt links to. They are made FROM the human pages at stage time, so they can only ever
say what the human page says. Stdlib only, runs in GitHub Actions.

    python3 -I _build/build_md.py _site
"""
import html
import os
import re
import sys
from html.parser import HTMLParser

SITE = "https://deepclean.au"
SKIP_TAGS = {"script", "style", "noscript", "svg", "form", "button", "select", "textarea", "template", "iframe"}
SKIP_CLASSES = {"dc-callbar", "hamburger", "header-cta-buttons", "carousel-btn", "sp-crumbs", "hero-images",
                "hero-logo-section", "hero-logo-mobile", "dc-quote-form", "quote-modal"}
VOID = {"br", "img", "hr", "input", "meta", "link", "source", "wbr"}
BLOCK = {"p", "div", "section", "article", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figure",
         "figcaption", "details", "summary", "tr", "ul", "ol", "table", "main", "footer", "header"}


class ToMd(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.stack = []          # (tag, skipping)
        self.skip = 0
        self.href = None
        self.link_text = []
        self.list_depth = 0
        self.title = ""
        self.desc = ""
        self.in_title = False
        self.in_main_or_footer = 0

    def _skipping(self, tag, attrs):
        a = dict(attrs)
        cls = set((a.get("class") or "").split())
        return tag in SKIP_TAGS or bool(cls & SKIP_CLASSES) or a.get("aria-hidden") == "true" or tag == "nav"

    def emit(self, s):
        if self.skip or not self.in_main_or_footer:
            return
        if self.href is not None:
            self.link_text.append(s)
        else:
            self.out.append(s)

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
        skipping = self._skipping(tag, attrs)
        self.stack.append((tag, skipping))
        if skipping:
            self.skip += 1
            return
        if tag in ("main", "footer"):
            self.in_main_or_footer += 1
        if tag in BLOCK:
            self.emit("\n\n")
        if re.fullmatch(r"h[1-6]", tag):
            self.emit("#" * int(tag[1]) + " ")
        elif tag == "li":
            self.emit("- ")
        elif tag == "blockquote":
            self.emit("> ")
        elif tag == "summary":
            self.emit("**")
        elif tag in ("strong", "b"):
            self.emit("**")
        elif tag == "span":
            self.emit(" ")  # card titles and captions are sibling spans; keep the words apart
        elif tag == "a" and not self.skip:
            href = a.get("href", "")
            if href and not href.startswith("#") and not href.startswith("javascript:"):
                if not re.match(r"^(https?:|tel:|mailto:)", href):
                    href = f"{SITE}/{href.lstrip('/')}"
                self.href = href
                self.link_text = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in VOID:
            return
        # pop to the matching tag (tolerates sloppy markup)
        while self.stack:
            t, skipping = self.stack.pop()
            if skipping:
                self.skip -= 1
            elif t in ("main", "footer"):
                self.in_main_or_footer -= 1
            if t == tag:
                break
        if self.skip:
            return
        if tag == "a" and self.href is not None:
            text = re.sub(r"\s+", " ", "".join(self.link_text)).strip()
            href, self.href = self.href, None
            if text:
                self.emit(f"[{text}]({href})")
        elif tag in ("strong", "b", "summary"):
            self.emit("**")
        if tag in BLOCK:
            self.emit("\n\n")

    def handle_data(self, data):
        if self.in_title:
            self.title += data
            return
        self.emit(re.sub(r"\s+", " ", data))


def convert(path, name):
    p = ToMd()
    p.feed(open(path, encoding="utf-8").read())
    body = "".join(p.out)
    body = re.sub(r"\*\*\s*\*\*", "", body)
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n[ \t]+", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    url = SITE + "/" if name == "index.html" else f"{SITE}/{name}"
    head = f"# {html.unescape(p.title).strip()}\n\n"
    if p.desc:
        head += f"> {html.unescape(p.desc).strip()}\n\n"
    head += f"Page: {url}\nPhone: 0433 147 018 | Email: deepclean.go2@gmail.com\n\n---\n\n"
    return head + body + "\n"


def main(site_dir):
    md_dir = os.path.join(site_dir, "md")
    os.makedirs(md_dir, exist_ok=True)
    n = 0
    for name in sorted(os.listdir(site_dir)):
        if not name.endswith(".html") or name.startswith("google"):
            continue
        out = convert(os.path.join(site_dir, name), name)
        open(os.path.join(md_dir, name[:-5] + ".md"), "w", encoding="utf-8").write(out)
        n += 1
    print(f"markdown: {n} pages -> {md_dir}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "_site")
