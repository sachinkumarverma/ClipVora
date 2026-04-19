"""
Social media scraper fallback for ClipVora.
Called by Node.js backend when yt-dlp fails.
Usage: python3 scraper.py <platform> <url>
Outputs JSON to stdout.
"""
import sys
import json
import re
import os
import glob
import html
import urllib.request


def resolve_short_url(url):
    """Follow redirects to get the final URL."""
    req = urllib.request.Request(url, method='HEAD', headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return resp.url
    except urllib.error.HTTPError as e:
        if e.headers.get('Location'):
            return e.headers['Location']
        return url
    except Exception:
        return url


def scrape_instagram(url):
    import instaloader
    L = instaloader.Instaloader()

    session_files = glob.glob(os.path.expanduser("~/.config/instaloader/session-*"))
    if session_files:
        username = os.path.basename(session_files[0]).replace("session-", "")
        try:
            L.load_session_from_file(username)
        except Exception:
            pass

    match = re.search(r'/(p|reel|reels|tv)/([A-Za-z0-9_-]+)', url)
    shortcode = match.group(2) if match else None

    if not shortcode:
        return {"error": "Could not extract shortcode from URL"}

    try:
        post = instaloader.Post.from_shortcode(L.context, shortcode)
    except Exception as e:
        return {"error": f"Failed to fetch post: {str(e)}"}

    result = {
        "title": (post.caption or "Instagram Post")[:200],
        "thumbnail": post.url,
        "videos": [],
        "images": [],
        "extractor": "instagram",
    }

    if post.typename == "GraphSidecar":
        for node in post.get_sidecar_nodes():
            if node.is_video:
                result["videos"].append({"url": node.video_url, "ext": "mp4"})
            else:
                result["images"].append({
                    "url": node.display_url, "ext": "jpg",
                    "width": node.dimensions[0] if node.dimensions else None,
                    "height": node.dimensions[1] if node.dimensions else None,
                })
    elif post.is_video:
        result["videos"].append({"url": post.video_url, "ext": "mp4"})
    else:
        result["images"].append({
            "url": post.url, "ext": "jpg",
            "width": post.dimensions[0] if post.dimensions else None,
            "height": post.dimensions[1] if post.dimensions else None,
        })

    return result


def scrape_facebook(url):
    import facebook_scraper as fs

    try:
        gen = fs.get_posts(post_urls=[url], options={"comments": 0})
        post = next(gen)
    except Exception as e:
        return {"error": f"Failed to fetch post: {str(e)}"}

    result = {
        "title": (post.get("text") or "Facebook Post")[:200],
        "thumbnail": post.get("video_thumbnail") or post.get("image"),
        "videos": [],
        "images": [],
        "extractor": "facebook",
    }

    if post.get("video"):
        result["videos"].append({"url": post["video"], "ext": "mp4"})

    images = post.get("images") or []
    if not images and post.get("image"):
        images = [post["image"]]

    for img_url in images:
        if img_url:
            result["images"].append({"url": img_url, "ext": "jpg"})

    return result


def scrape_pinterest(url):
    import contextlib, io

    # Resolve pin.it short URLs to full pinterest.com URLs
    if 'pin.it/' in url:
        url = resolve_short_url(url)
        url = url.split('?')[0]

    result = {
        "title": "Pinterest Pin",
        "thumbnail": None,
        "videos": [],
        "images": [],
        "extractor": "pinterest",
    }

    # First try to get video by fetching the pin page directly
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html',
        })
        resp = urllib.request.urlopen(req, timeout=15)
        page_html = resp.read().decode('utf-8', errors='ignore')

        # Extract video URL from page JSON data
        video_match = re.search(r'"url":"(https://v1\.pinimg\.com/videos/[^"]+\.mp4)"', page_html)
        if video_match:
            result["videos"].append({"url": video_match.group(1), "ext": "mp4"})

        # Also try V_720P format
        video_720 = re.search(r'"V_720P"[^}]*"url":"([^"]+)"', page_html)
        if video_720 and video_720.group(1) not in [v["url"] for v in result["videos"]]:
            result["videos"].append({"url": video_720.group(1).replace('\\u002F', '/'), "ext": "mp4", "quality": "720p"})

        # Extract title
        title_match = re.search(r'"title":"([^"]*)"', page_html)
        if title_match and title_match.group(1):
            result["title"] = html.unescape(title_match.group(1))[:200]

        # Extract thumbnail
        thumb_match = re.search(r'"url":"(https://i\.pinimg\.com/[^"]*originals[^"]*)"', page_html)
        if thumb_match:
            result["thumbnail"] = thumb_match.group(1).replace('\\u002F', '/')
    except Exception:
        pass

    # Then use pinterest-dl for images
    try:
        from pinterest_dl import PinterestDL
        api = PinterestDL.with_api()

        with contextlib.redirect_stderr(io.StringIO()):
            pins = api.scrape(url=url, num=10)

        for pin in pins:
            img_url = pin.src if hasattr(pin, 'src') else str(pin)
            if img_url:
                result["images"].append({"url": img_url, "ext": "jpg"})
                if not result["thumbnail"]:
                    result["thumbnail"] = img_url

        if pins and hasattr(pins[0], 'alt') and pins[0].alt and result["title"] == "Pinterest Pin":
            result["title"] = pins[0].alt[:200]
    except Exception:
        pass

    if not result["videos"] and not result["images"]:
        return {"error": "Failed to fetch pin content"}

    return result


def scrape_linkedin(url):
    """Scrape LinkedIn video from embed page data-sources attribute."""

    # Extract activity ID from various LinkedIn URL formats
    activity_id = None
    m = re.search(r'activity[:-](\d+)', url)
    if m:
        activity_id = m.group(1)
    else:
        m = re.search(r'ugcPost[:-](\d+)', url)
        if m:
            activity_id = m.group(1)

    if not activity_id:
        return {"error": "Could not extract LinkedIn post ID from URL"}

    # Fetch embed page which contains video sources
    embed_url = f"https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:{activity_id}"
    req = urllib.request.Request(embed_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })

    try:
        resp = urllib.request.urlopen(req, timeout=15)
        page = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        return {"error": f"Failed to fetch LinkedIn embed: {str(e)}"}

    result = {
        "title": "LinkedIn Video",
        "thumbnail": None,
        "videos": [],
        "images": [],
        "extractor": "linkedin",
    }

    # Extract title from description meta tag
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', page, re.I)
    if desc_match:
        result["title"] = html.unescape(desc_match.group(1))[:200]

    # Extract video sources from data-sources attribute
    sources_match = re.search(r'data-sources="([^"]+)"', page)
    if sources_match:
        sources_raw = html.unescape(sources_match.group(1))
        try:
            sources = json.loads(sources_raw)
            # Sort by bitrate (highest first)
            sources.sort(key=lambda s: s.get('data-bitrate', 0), reverse=True)
            for src in sources:
                video_url = src.get('src', '')
                if video_url:
                    # Determine quality from URL
                    quality = 'Video'
                    q_match = re.search(r'mp4-(\d+p)', video_url)
                    if q_match:
                        quality = q_match.group(1)
                    result["videos"].append({
                        "url": video_url, "ext": "mp4", "quality": quality
                    })
        except json.JSONDecodeError:
            pass

    # Extract thumbnail
    thumb_match = re.search(r'(https://dms\.licdn\.com/[^"&]+thumbnail[^"&]+)', page)
    if thumb_match:
        result["thumbnail"] = html.unescape(thumb_match.group(1))

    # If no video found, check for images
    if not result["videos"]:
        img_matches = re.findall(r'(https://media\.licdn\.com/dms/image/[^"&\s]+)', page)
        for img_url in img_matches:
            clean = html.unescape(img_url)
            if clean not in [i["url"] for i in result["images"]]:
                result["images"].append({"url": clean, "ext": "jpg"})
                if not result["thumbnail"]:
                    result["thumbnail"] = clean

    return result


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: scraper.py <platform> <url>"}))
        sys.exit(1)

    platform = sys.argv[1].lower()
    url = sys.argv[2]

    scrapers = {
        "instagram": scrape_instagram,
        "facebook": scrape_facebook,
        "pinterest": scrape_pinterest,
        "linkedin": scrape_linkedin,
    }

    scraper = scrapers.get(platform)
    if not scraper:
        print(json.dumps({"error": f"Unknown platform: {platform}"}))
        sys.exit(1)

    try:
        result = scraper(url)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
