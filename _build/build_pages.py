#!/usr/bin/env python3
"""Generate suburb + service pages, normalise footer/canonicals sitewide, write sitemap.

Run from repo root:  python3 -I _build/build_pages.py
"""
import html
import json
import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "_build"))
from content import PHOTOS, QUOTES, SERVICES, SUBURBS  # noqa: E402

SITE = "https://deepclean.au"
TODAY = date.today().isoformat()
OG = SITE + "/assets/images/og-share.jpg"
LOGO = SITE + "/assets/DEEP%20CLEAN%20Logo.png"
FB = "https://www.facebook.com/share/1JCe6ozY2t/"
BIZ_ID = SITE + "/#business"

AREAS = [(slug, d["name"]) for slug, d in SUBURBS.items()]
SERVICE_LINKS = [(slug, d["name"]) for slug, d in SERVICES.items()]

# Public pages that already exist (hand-built). Generated pages are added below.
EXISTING = [
    ("index.html", "1.0", "weekly"),
    ("services.html", "0.9", "monthly"),
    ("brisbane-bayside-cleaning.html", "0.9", "monthly"),
    ("about.html", "0.7", "monthly"),
    ("gallery.html", "0.6", "monthly"),
    ("before-after-case-studies.html", "0.7", "monthly"),
    ("cleaning-tips-brisbane.html", "0.6", "monthly"),
    ("spring-cleaning-guide-birkdale.html", "0.6", "monthly"),
    ("contact.html", "0.8", "monthly"),
    ("careers.html", "0.5", "monthly"),
    ("apply.html", "0.3", "yearly"),
]

BUSINESS = {
    "@type": "LocalBusiness",
    "@id": BIZ_ID,
    "name": "DEEP CLEAN",
    "description": "Boutique cleaning company based in Birkdale, providing high-end residential, deep and post-construction cleaning across Brisbane Bayside and south-east Brisbane.",
    "url": SITE + "/",
    "logo": LOGO,
    "image": OG,
    "telephone": "+61433147018",
    "email": "deepclean.go2@gmail.com",
    "priceRange": "$$",
    "address": {"@type": "PostalAddress", "addressLocality": "Birkdale", "postalCode": "4159", "addressRegion": "QLD", "addressCountry": "AU"},
    "areaServed": [{"@type": "Place", "name": n + ", QLD"} for _, n in AREAS] + [{"@type": "Place", "name": "Brisbane Bayside"}, {"@type": "City", "name": "Brisbane"}],
    "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "opens": "07:00", "closes": "18:00"}],
    "founder": {"@type": "Person", "name": "Amie Eckhardt"},
    "sameAs": [FB],
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": d["name"], "url": f"{SITE}/{s}.html"}}
            for s, d in SERVICES.items()
        ],
    },
}

E = html.escape


def ld(obj):
    return '<script type="application/ld+json">\n' + json.dumps(obj, indent=2, ensure_ascii=False) + "\n</script>"


def breadcrumbs(trail):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": f"{SITE}/{href}" if href != "index.html" else SITE + "/"}
            for i, (href, name) in enumerate(trail)
        ],
    }


def faq_schema(faqs):
    return {
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs
        ],
    }


# ---------------------------------------------------------------- shared chrome

HEADER = """    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="logo">
                    <a href="index.html">
                        <img src="assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN Logo" class="logo-img">
                    </a>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="services.html" class="nav-link{svc_active}">Services</a></li>
                    <li><a href="about.html" class="nav-link">About</a></li>
                    <li><a href="gallery.html" class="nav-link">Gallery</a></li>
                    <li><a href="contact.html" class="nav-link">Contact</a></li>
                    <li><a href="careers.html" class="nav-link">Careers</a></li>
                </ul>
                <div class="header-cta-buttons">
                    <a href="tel:0433147018" class="call-button">Call Now</a>
                    <a href="contact.html" class="cta-button">Get Quote</a>
                </div>
                <button class="hamburger" aria-label="Menu" type="button" onclick="document.querySelector('.nav-menu').classList.toggle('active'); this.classList.toggle('active');">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>"""


def footer_html():
    svc = "\n".join(f'                        <li><a href="{s}.html">{E(n)}</a></li>' for s, n in SERVICE_LINKS)
    areas = "\n".join(f'                        <li><a href="{s}.html">{E(n)}</a></li>' for s, n in AREAS)
    return f"""    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="logo">
                        <img src="assets/DEEP CLEAN Logo.png" alt="DEEP CLEAN Logo" class="logo-img">
                    </div>
                    <p>Boutique cleaning company based in Birkdale. Professional, reliable and thorough across Brisbane Bayside and south-east Brisbane.</p>
                </div>
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
{svc}
                        <li><a href="services.html">All Services</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Areas We Clean</h4>
                    <ul>
{areas}
                        <li><a href="brisbane-bayside-cleaning.html">All Brisbane Bayside</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Guides</h4>
                    <ul>
                        <li><a href="cleaning-tips-brisbane.html">Brisbane Cleaning Tips</a></li>
                        <li><a href="spring-cleaning-guide-birkdale.html">Spring Cleaning Guide</a></li>
                        <li><a href="before-after-case-studies.html">Before &amp; After Case Studies</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="careers.html">Join Our Team</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <p>Phone: <a href="tel:0433147018" class="footer-link">0433 147 018</a><br>
                    Email: deepclean.go2@gmail.com<br>
                    ABN: 57 805 931 28<br>
                    Based in Birkdale QLD 4159<br>
                    Mon to Sat, 7am to 6pm<br>
<a href="{FB}" target="_blank" rel="noopener" style="color: rgba(255, 255, 255, 0.8); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s ease;" onmouseover="this.style.color='#1e7ca8'" onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Follow us on Facebook</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; {date.today().year} DEEP CLEAN. All rights reserved.</p>
            </div>
        </div>
    </footer>"""


def head(title, desc, path, schema_nodes):
    url = f"{SITE}/{path}"
    graph = {"@context": "https://schema.org", "@graph": schema_nodes}
    return f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{E(title)}</title>
    <meta name="description" content="{E(desc)}">
    <link rel="canonical" href="{url}">
    <meta property="og:title" content="{E(title)}">
    <meta property="og:description" content="{E(desc)}">
    <meta property="og:image" content="{OG}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="DEEP CLEAN">
    <meta property="og:locale" content="en_AU">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{E(title)}">
    <meta name="twitter:description" content="{E(desc)}">
    <meta name="twitter:image" content="{OG}">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="seo-pages.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    {ld(graph)}
</head>"""


# ---------------------------------------------------------------- blocks

ICON_CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
ICON_PIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
ICON_ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
ICON_QUOTE = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.17 17q-1.37 0-2.27-.98T4 13.5q0-2.24 1.27-4.37T9 5.5l1 1.25q-1.6 1.15-2.37 2.33t-.88 2.42q.18-.05.42-.05 1.2 0 2.02.84t.81 2.07q0 1.2-.84 2.07T7.17 17Zm9 0q-1.37 0-2.27-.98T13 13.5q0-2.24 1.27-4.37T18 5.5l1 1.25q-1.6 1.15-2.37 2.33t-.88 2.42q.18-.05.42-.05 1.2 0 2.02.84t.81 2.07q0 1.2-.84 2.07t-1.99.88Z"/></svg>'
STARS = '<span class="sp-stars" aria-label="5 out of 5 stars">' + "".join(
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    for _ in range(5)) + "</span>"


def crumbs_html(trail):
    parts = []
    for i, (href, name) in enumerate(trail):
        if i == len(trail) - 1:
            parts.append(f'<span aria-current="page">{E(name)}</span>')
        else:
            parts.append(f'<a href="{href}">{E(name)}</a>')
    return '<nav class="sp-crumbs" aria-label="Breadcrumb">' + '<span class="sp-sep">/</span>'.join(parts) + "</nav>"


def hero(trail, h1, lede):
    return f"""        <section class="page-hero sp-hero">
            <div class="container">
                {crumbs_html(trail)}
                <div class="page-hero-content">
                    <h1>{E(h1)}</h1>
                    <p class="sp-lede">{E(lede)}</p>
                    <div class="sp-hero-cta">
                        <a href="contact.html" class="btn btn-primary">Get a Free Quote</a>
                        <a href="tel:0433147018" class="btn btn-secondary">Call 0433 147 018</a>
                    </div>
                    <ul class="sp-trust">
                        <li>{ICON_CHECK} Insured &amp; police checked</li>
                        <li>{ICON_CHECK} No lock-in contracts</li>
                        <li>{ICON_CHECK} Locally owned in Birkdale</li>
                    </ul>
                </div>
            </div>
        </section>"""


def quote_html(key):
    text, name, title = QUOTES[key]
    return f"""<figure class="sp-quote">
                        <span class="sp-quote-mark">{ICON_QUOTE}</span>
                        {STARS}
                        <blockquote>{E(text)}</blockquote>
                        <figcaption><strong>{E(name)}</strong><span>{E(title)}</span></figcaption>
                    </figure>"""


def photos_html(keys, heading):
    items = "\n".join(
        f'<figure class="sp-photo"><img src="{E(PHOTOS[k][0])}" alt="{E(PHOTOS[k][1])}" loading="lazy" width="1200" height="900"><figcaption>{E(PHOTOS[k][1])}</figcaption></figure>'
        for k in keys
    )
    return f"""        <section class="sp-section">
            <div class="container">
                <h2 class="sp-h2">{E(heading)}</h2>
                <div class="sp-photos">
{items}
                </div>
                <p class="sp-more"><a href="gallery.html">See more of our work {ICON_ARROW}</a></p>
            </div>
        </section>"""


def faq_html(faqs, heading):
    items = "\n".join(
        f"""                    <details class="sp-faq">
                        <summary>{E(q)}</summary>
                        <p>{E(a)}</p>
                    </details>""" for q, a in faqs)
    return f"""        <section class="sp-section sp-alt">
            <div class="container sp-narrow">
                <h2 class="sp-h2">{E(heading)}</h2>
{items}
            </div>
        </section>"""


def cta_html(heading, text):
    return f"""        <section class="cta-section">
            <div class="container">
                <div class="cta-content">
                    <h2>{E(heading)}</h2>
                    <p>{E(text)}</p>
                    <div class="cta-buttons">
                        <a href="contact.html" class="btn btn-primary">Get Free Quote</a>
                        <a href="tel:0433147018" class="btn btn-secondary">Call 0433 147 018</a>
                    </div>
                </div>
            </div>
        </section>"""


def link_cards(items, heading, sub=None):
    cards = "\n".join(
        f'<a class="sp-link-card" href="{href}.html"><span class="sp-link-title">{E(title)}</span><span class="sp-link-text">{E(text)}</span><span class="sp-link-go">{ICON_ARROW}</span></a>'
        for href, title, text in items)
    subp = f'<p class="sp-sub">{E(sub)}</p>' if sub else ""
    return f"""        <section class="sp-section">
            <div class="container">
                <h2 class="sp-h2">{E(heading)}</h2>
                {subp}
                <div class="sp-link-grid">
{cards}
                </div>
            </div>
        </section>"""


def page(title, desc, path, schema, body, svc_active=False):
    return "\n".join([
        head(title, desc, path, schema),
        "<body>",
        HEADER.replace("{svc_active}", " active" if svc_active else ""),
        "    <main>",
        body,
        "    </main>",
        "",
        footer_html(),
        "",
        '    <script src="script.js"></script>',
        "</body>",
        "</html>",
        "",
    ])


# ---------------------------------------------------------------- page builders

def build_service(slug, d):
    path = f"{slug}.html"
    trail = [("index.html", "Home"), ("services.html", "Services"), (path, d["name"])]
    schema = [
        {
            "@type": "Service",
            "@id": f"{SITE}/{path}#service",
            "name": d["name"],
            "serviceType": d["service_type"],
            "description": d["desc"],
            "url": f"{SITE}/{path}",
            "provider": {"@id": BIZ_ID, "@type": "LocalBusiness", "name": "DEEP CLEAN", "url": SITE + "/", "telephone": "+61433147018"},
            "areaServed": BUSINESS["areaServed"],
        },
        breadcrumbs(trail),
        faq_schema(d["faqs"]),
    ]
    intro = "\n".join(f"<p>{E(p)}</p>" for p in d["intro"])
    when = "\n".join(f'<div class="sp-card"><h3>{E(t)}</h3><p>{E(x)}</p></div>' for t, x in d["when"])
    incl = "\n".join(f"<li>{ICON_CHECK}<span>{E(x)}</span></li>" for x in d["includes"])
    quotes = quote_html(d["quote"]) + (quote_html(d["quote2"]) if d.get("quote2") else "")
    areas = [(s, f"{SUBURBS[s]['name']}", f"{d['short']} in {SUBURBS[s]['name']} {SUBURBS[s]['postcode']}") for s in SUBURBS]
    others = [(s, o["name"], o["lede"].split(".")[0] + ".") for s, o in SERVICES.items() if s != slug]
    body = "\n".join([
        hero(trail, d["h1"], d["lede"]),
        f"""        <section class="sp-section">
            <div class="container sp-split">
                <div class="sp-prose">
                    {intro}
                </div>
                <div class="sp-quotes">
                    {quotes}
                </div>
            </div>
        </section>""",
        f"""        <section class="sp-section sp-alt">
            <div class="container">
                <h2 class="sp-h2">{E(d['when_title'])}</h2>
                <div class="sp-cards">
{when}
                </div>
            </div>
        </section>""",
        f"""        <section class="sp-section">
            <div class="container sp-narrow">
                <h2 class="sp-h2">{E(d['includes_title'])}</h2>
                <ul class="sp-checklist">
{incl}
                </ul>
                <p class="sp-note">{E(d['includes_note'])}</p>
            </div>
        </section>""",
        photos_html(d["photos"], f"Recent {d['short'].lower()} work"),
        link_cards(areas, f"{d['short']} near you", "Based in Birkdale, cleaning across Brisbane Bayside and the Redlands."),
        faq_html(d["faqs"], f"{d['name']} questions"),
        link_cards(others, "Other services"),
        cta_html(f"Book your {d['short'].lower()}", "Tell us about your home and we'll come back with a clear, free quote."),
    ])
    return path, page(d["title"], d["desc"], path, schema, body, svc_active=True)


def build_suburb(slug, d):
    path = f"{slug}.html"
    trail = [("index.html", "Home"), ("brisbane-bayside-cleaning.html", "Brisbane Bayside"), (path, d["name"])]
    schema = [
        {
            "@type": "Service",
            "@id": f"{SITE}/{path}#service",
            "name": f"House Cleaning in {d['name']}",
            "serviceType": "House cleaning",
            "description": d["desc"],
            "url": f"{SITE}/{path}",
            "provider": {"@id": BIZ_ID, "@type": "LocalBusiness", "name": "DEEP CLEAN", "url": SITE + "/", "telephone": "+61433147018"},
            "areaServed": {"@type": "Place", "name": f"{d['name']} QLD {d['postcode']}"},
        },
        breadcrumbs(trail),
        faq_schema(d["faqs"]),
    ]
    intro = "\n".join(f"<p>{E(p)}</p>" for p in d["intro"])
    local = "\n".join(f"<p>{E(p)}</p>" for p in d["local"])
    quotes = "\n".join(quote_html(k) for k in d["quotes"])
    svc_items = [(s, f"{SERVICES[s]['name']}", f"{SERVICES[s]['short']} for {d['name']} homes. " + SERVICES[s]["lede"].split(".")[0] + ".") for s in d["services"]]
    nearby = "\n".join(f'<a href="{s}.html" class="sp-chip">{ICON_PIN}{E(SUBURBS[s]["name"])}</a>' for s in d["nearby"])
    body = "\n".join([
        hero(trail, d["h1"], d["lede"]),
        f"""        <section class="sp-section">
            <div class="container sp-split">
                <div class="sp-prose">
                    <h2 class="sp-h2 sp-left">Your local {E(d['name'])} cleaners</h2>
                    {intro}
                </div>
                <div class="sp-quotes">
                    {quotes}
                </div>
            </div>
        </section>""",
        link_cards(svc_items, f"Cleaning services in {d['name']}"),
        f"""        <section class="sp-section sp-alt">
            <div class="container sp-narrow">
                <h2 class="sp-h2">{E(d['local_title'])}</h2>
                <div class="sp-prose">
                    {local}
                    <p>For more on keeping a Brisbane home fresh through the humid months, read our <a href="cleaning-tips-brisbane.html">cleaning tips for Brisbane's climate</a>.</p>
                </div>
            </div>
        </section>""",
        photos_html(d["photos"], "Recent work from our team"),
        faq_html(d["faqs"], f"Cleaning in {d['name']}: common questions"),
        f"""        <section class="sp-section">
            <div class="container sp-narrow sp-center">
                <h2 class="sp-h2">Nearby areas we clean</h2>
                <div class="sp-chips">
{nearby}
                    <a href="brisbane-bayside-cleaning.html" class="sp-chip">{ICON_PIN}All Brisbane Bayside</a>
                </div>
            </div>
        </section>""",
        cta_html(f"Ready for a spotless {d['name']} home?", f"Get a free, no-obligation quote from your local {d['name']} cleaning team."),
    ])
    return path, page(d["title"], d["desc"], path, schema, body)


# ---------------------------------------------------------------- existing-page passes

FOOTER_RE = re.compile(r"[ \t]*<footer class=\"footer\">.*?</footer>", re.S)


def ensure_canonical(s, path):
    url = SITE + "/" if path == "index.html" else f"{SITE}/{path}"
    s = re.sub(r'\s*<link rel="canonical"[^>]*>', "", s)
    return s.replace("</title>", f'</title>\n    <link rel="canonical" href="{url}">', 1)


def set_meta(s, title=None, desc=None):
    if title:
        s = re.sub(r"<title>.*?</title>", f"<title>{E(title)}</title>", s, count=1, flags=re.S)
        s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + E(title), s)
        s = re.sub(r'(<meta name="twitter:title" content=")[^"]*', lambda m: m.group(1) + E(title), s)
    if desc:
        for attr in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
            s = re.sub(r'(<meta ' + attr + r' content=")[^"]*', lambda m: m.group(1) + E(desc), s)
    return s


def replace_first_ld(s, obj):
    return re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: ld(obj), s, count=1, flags=re.S)


AREA_STRIP = """        <section class="sp-section home-areas">
            <div class="container">
                <h2 class="sp-h2">Where we clean</h2>
                <p class="sp-sub">Based in Birkdale, cleaning homes right across Brisbane Bayside and the Redlands.</p>
                <div class="sp-chips">
{chips}
                </div>
                <div class="sp-link-grid home-services">
{cards}
                </div>
            </div>
        </section>
"""

META = {
    "index.html": ("Birkdale Cleaning Company | Brisbane Bayside Cleaners | DEEP CLEAN",
                   "DEEP CLEAN is Birkdale's boutique cleaning company. House cleaning, deep cleans and builders cleans across Brisbane Bayside. Insured, police checked. Free quote."),
    "services.html": ("Cleaning Services Brisbane Bayside & Birkdale | DEEP CLEAN",
                      "Deep cleans, weekly and fortnightly house cleaning, builders cleans and NIISQ cleaning across Brisbane Bayside. Boutique Birkdale team. Free quote."),
    "brisbane-bayside-cleaning.html": ("Brisbane Bayside Cleaning Services | Redlands Cleaners | DEEP CLEAN",
                                       "Local cleaners for Brisbane Bayside: Birkdale, Wellington Point, Cleveland, Thornlands, Redland Bay and Victoria Point. Insured, police checked. Free quote."),
    "before-after-case-studies.html": ("Before & After Cleaning Transformations Brisbane | DEEP CLEAN", "Real before and after results from deep cleans, builders cleans and regular cleans across Brisbane Bayside and south-east Brisbane."),
    "cleaning-tips-brisbane.html": (None, "How to keep a Brisbane home clean in humid weather: mould prevention, bathroom and wardrobe tips, and a seasonal routine from local Birkdale cleaners."),
    "spring-cleaning-guide-birkdale.html": (None, "A room-by-room spring cleaning guide for Birkdale and Brisbane homes, with a printable checklist from DEEP CLEAN's local team."),
    "about.html": ("About DEEP CLEAN | Boutique Cleaners in Birkdale, Brisbane Bayside", None),
    "gallery.html": ("Cleaning Gallery | Before & After Work in Brisbane | DEEP CLEAN", None),
}


def patch_existing():
    for path, _, _ in EXISTING:
        fp = os.path.join(ROOT, path)
        s = open(fp, encoding="utf-8").read()
        s = ensure_canonical(s, path)
        if path in META:
            s = set_meta(s, *META[path])
        s = FOOTER_RE.sub(footer_html(), s, count=1)
        if 'href="seo-pages.css"' not in s:
            s = s.replace('<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" href="styles.css">\n    <link rel="stylesheet" href="seo-pages.css">', 1)

        if path == "index.html":
            s = replace_first_ld(s, {"@context": "https://schema.org", "@graph": [
                BUSINESS,
                {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "DEEP CLEAN", "publisher": {"@id": BIZ_ID}, "inLanguage": "en-AU"},
            ]})
            s = s.replace(
                "Brisbane Bayside & Birkdale's boutique cleaning service providing high-end residential and post-construction cleaning with meticulous attention to detail.",
                'DEEP CLEAN is a boutique Birkdale cleaning company providing high-end <a href="recurring-house-cleaning.html">house cleaning</a>, <a href="deep-cleaning-brisbane.html">deep cleans</a> and <a href="post-construction-cleaning-brisbane.html">post-construction cleaning</a> across Brisbane Bayside, with meticulous attention to detail.')
            # Hero image is above the fold: load it eagerly for LCP.
            s = s.replace('<img src="assets/images/hero/hero-1.jpg" alt="DEEP CLEAN team professional cleaning service" loading="lazy"',
                          '<img src="assets/images/hero/hero-1.jpg" alt="DEEP CLEAN team professional cleaning service" fetchpriority="high"')
            if "home-areas" not in s:
                chips = "\n".join(f'                    <a href="{sl}.html" class="sp-chip">{ICON_PIN}{E(n)}</a>' for sl, n in AREAS)
                cards = "\n".join(
                    f'<a class="sp-link-card" href="{sl}.html"><span class="sp-link-title">{E(d["name"])}</span><span class="sp-link-text">{E(d["lede"].split(".")[0])}.</span><span class="sp-link-go">{ICON_ARROW}</span></a>'
                    for sl, d in SERVICES.items())
                s = s.replace('        <section class="testimonials-carousel home-testimonials">',
                              AREA_STRIP.format(chips=chips, cards=cards) + '        <section class="testimonials-carousel home-testimonials">', 1)

        if path == "brisbane-bayside-cleaning.html":
            s = replace_first_ld(s, {"@context": "https://schema.org", "@graph": [
                {"@type": "Service", "@id": f"{SITE}/{path}#service", "name": "Brisbane Bayside Cleaning Services", "serviceType": "House cleaning",
                 "url": f"{SITE}/{path}", "provider": {"@id": BIZ_ID, "@type": "LocalBusiness", "name": "DEEP CLEAN", "url": SITE + "/", "telephone": "+61433147018"},
                 "areaServed": BUSINESS["areaServed"]},
                breadcrumbs([("index.html", "Home"), (path, "Brisbane Bayside")]),
            ]})
            for sl, d in SUBURBS.items():
                n = d["name"]
                s = re.sub(rf'(<div class="area-card">\s*)<h4>{n}</h4>',
                           rf'\1<h4><a href="{sl}.html">{n}</a></h4>', s)
                s = re.sub(rf'(<h4><a href="{sl}.html">{n}</a></h4>\s*<p>.*?)(</p>)',
                           rf'\1 <a href="{sl}.html" class="sp-inline-more">Cleaning in {n}</a>\2', s, count=1, flags=re.S)
            s = s.replace('"url": "https://deepclean.au/brisbane-bayside-cleaning"', '"url": "https://deepclean.au/brisbane-bayside-cleaning.html"')

        if path == "services.html":
            for sl, key in [("deep-cleaning-brisbane", "deep-clean"), ("recurring-house-cleaning", "recurring-basic"),
                            ("recurring-house-cleaning", "recurring-premium"), ("post-construction-cleaning-brisbane", "post-construction"),
                            ("niisq-cleaning", "ndis-funded")]:
                block = re.search(rf'<div class="service-card[^"]*" data-service="{key}">.*?<div class="service-cta">', s, re.S)
                if block and f'href="{sl}.html"' not in block.group(0):
                    new = block.group(0).replace('<div class="service-cta">',
                        f'<div class="service-cta">\n                                <a href="{sl}.html" class="btn btn-outline">Learn more</a>')
                    s = s.replace(block.group(0), new, 1)
            if "services-areas" not in s:
                chips = "\n".join(f'                    <a href="{sl}.html" class="sp-chip">{ICON_PIN}{E(n)}</a>' for sl, n in AREAS)
                s = s.replace('        <section class="cta-section">',
                    f"""        <section class="sp-section services-areas">
            <div class="container sp-narrow sp-center">
                <h2 class="sp-h2">Areas we service</h2>
                <p class="sp-sub">Locally owned in Birkdale, cleaning across Brisbane Bayside and the Redlands.</p>
                <div class="sp-chips">
{chips}
                </div>
            </div>
        </section>

        <section class="cta-section">""", 1)
        open(fp, "w", encoding="utf-8").write(s)


def write_sitemap(generated):
    rows = [(p, pr, cf) for p, pr, cf in EXISTING] + [(p, "0.8", "monthly") for p in generated]
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pr, cf in rows:
        loc = SITE + "/" if p == "index.html" else f"{SITE}/{p}"
        out += ["  <url>", f"    <loc>{loc}</loc>", f"    <lastmod>{TODAY}</lastmod>", f"    <changefreq>{cf}</changefreq>", f"    <priority>{pr}</priority>", "  </url>"]
    out.append("</urlset>\n")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(out))


def main():
    generated = []
    for slug, d in SERVICES.items():
        p, h = build_service(slug, d)
        open(os.path.join(ROOT, p), "w", encoding="utf-8").write(h)
        generated.append(p)
    for slug, d in SUBURBS.items():
        p, h = build_suburb(slug, d)
        open(os.path.join(ROOT, p), "w", encoding="utf-8").write(h)
        generated.append(p)
    patch_existing()
    write_sitemap(generated)
    print("generated:", ", ".join(generated))


if __name__ == "__main__":
    main()
