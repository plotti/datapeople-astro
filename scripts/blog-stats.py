#!/usr/bin/env python3
"""Blog-Abrufzahlen aus Umami Cloud im Terminal.

Aufruf:  npm run stats            (letzte 30 Tage)
         npm run stats -- 7       (letzte 7 Tage)
         npm run stats -- all     (seit Tracking-Start, 31.10.2026)

Die offizielle Umami-API gibt es nur im Pro-Plan. Deshalb geht das Skript über den
Freigabe-Link (Umami → Website → Share URL), mit derselben Schnittstelle, die auch
die Freigabe-Seite selbst nutzt. Braucht UMAMI_SHARE_ID in .env (der Teil nach /share/).
"""
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEBSITE_ID = "ed564447-d045-4430-b04c-43ed4cebaf5e"  # wie in src/components/umami.astro
API = "https://cloud.umami.is/analytics/eu/api"  # EU-Region; /share/<id> leitet dorthin um
BLOG_INDEX = "https://www.datapeople.ch/blog/"
TRACKING_START_MS = 1793404800000  # 2026-10-31 00:00 UTC


class StatsError(Exception):
    pass


def share_id() -> str:
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("UMAMI_SHARE_ID="):
                value = line.split("=", 1)[1].strip().strip('"')
                if value:
                    return value.rstrip("/").rsplit("/", 1)[-1]  # auch der ganze Link geht
    raise StatsError("UMAMI_SHARE_ID fehlt in .env – Umami → Website → Share URL, Teil nach /share/.")


def get_json(url: str, headers: dict | None = None):
    # Cloudflare vor Umami blockt den Python-Standard-User-Agent (Error 1010)
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0",
                                               **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def get(path: str, token: str, **params):
    # Headers wie die Freigabe-Seite: Token plus share-context "1"
    url = f"{API}/websites/{WEBSITE_ID}/{path}?{urllib.parse.urlencode(params)}"
    return get_json(url, {"x-umami-share-token": token, "x-umami-share-context": "1"})


def post_titles() -> dict:
    # Titel aus der Live-Blog-Übersicht, die enthält auch die .astro-Datenstorys
    req = urllib.request.Request(BLOG_INDEX, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            page = resp.read().decode()
    except urllib.error.URLError:
        return {}
    pattern = r'data-post-slug="([^"]+)"[^>]*aria-label="Artikel lesen: ([^"]+)"'
    return {f"/blog/{slug}/": html.unescape(title) for slug, title in re.findall(pattern, page)}


def fetch(arg: str):
    end = int(time.time() * 1000)
    if arg == "all":
        start, label = TRACKING_START_MS, "seit 31.10.2026"
    else:
        start, label = end - int(arg) * 86_400_000, f"letzte {arg} Tage"

    sid = share_id()
    params = {"startAt": start, "endAt": end}
    try:
        token = get_json(f"{API}/share/{sid}")["token"]
        stats = get("stats", token, **params)
        pages = get("metrics", token, type="path", limit=500, **params)
    except urllib.error.HTTPError as e:
        raise StatsError(f"Umami-Fehler {e.code}: {e.read().decode()[:200]}")
    except urllib.error.URLError as e:
        raise StatsError(f"Umami nicht erreichbar: {e.reason}")

    titles = post_titles()
    blog = {}
    for row in pages:
        path = urllib.parse.unquote(row["x"].split("?")[0].split("#")[0])
        if not path.startswith("/blog/") or path in ("/blog/", "/blog"):
            continue
        path = path if path.endswith("/") else path + "/"
        blog[path] = blog.get(path, 0) + row["y"]
    posts = [(views, titles.get(path, path), path)
             for path, views in sorted(blog.items(), key=lambda kv: -kv[1])]
    return label, stats.get("pageviews", 0), stats.get("visitors", 0), posts


def print_terminal(arg: str):
    try:
        label, pageviews, visitors, posts = fetch(arg)
    except StatsError as e:
        sys.exit(str(e))
    print(f"\ndatapeople.ch – {label}")
    print(f"Seitenaufrufe gesamt: {pageviews}   Besucher: {visitors}\n")
    if not posts:
        print("Noch keine Blog-Aufrufe im Zeitraum.")
        return
    print(f"{'Aufrufe':>7}  Blogpost")
    print(f"{'-' * 7}  {'-' * 60}")
    for views, title, _ in posts:
        print(f"{views:>7}  {title[:80]}")
    print(f"{'-' * 7}\n{sum(p[0] for p in posts):>7}  Blog gesamt\n")


def main():
    print_terminal(sys.argv[1] if len(sys.argv) > 1 else "30")


if __name__ == "__main__":
    main()
