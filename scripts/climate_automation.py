from __future__ import annotations

import json
import os
from pathlib import Path
import xml.etree.ElementTree as ET

import requests


def read_env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def strip_json_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json").removeprefix("```").strip()
        cleaned = cleaned.removesuffix("```").strip()
    return cleaned


def fetch_rss_items() -> list[dict]:
    feeds = [
        ("NASA Climate", read_env("NASA_CLIMATE_RSS_URL", "https://climate.nasa.gov/rss/news.xml")),
        ("IPCC", read_env("IPCC_RSS_URL", "https://www.ipcc.ch/feed/")),
    ]

    items: list[dict] = []

    for source_name, feed_url in feeds:
        response = requests.get(
            feed_url,
            timeout=60,
            headers={"user-agent": "Climate-Change-Awareness-Portal/1.0"},
        )
        response.raise_for_status()

        root = ET.fromstring(response.text)
        for item in root.findall("./channel/item"):
            title = (item.findtext("title") or "Climate update").strip()
            summary = (item.findtext("description") or item.findtext("summary") or title).strip()
            link = (item.findtext("link") or "").strip()
            published_at = (item.findtext("pubDate") or item.findtext("published") or "").strip()

            if not link:
                continue

            items.append(
                {
                    "title": title,
                    "summary": summary,
                    "link": link,
                    "source": source_name,
                    "published_at": published_at,
                }
            )

    limit = int(read_env("RSS_FEED_LIMIT", "6"))
    return items[:limit]


def format_rss_items(items: list[dict]) -> str:
    blocks: list[str] = []

    for index, item in enumerate(items, start=1):
        blocks.append(
            "\n".join(
                part
                for part in [
                    f"Source {index}: {item['source']}",
                    f"Title: {item['title']}",
                    f"Summary: {item['summary']}",
                    f"Link: {item['link']}",
                    f"Published: {item['published_at']}" if item.get("published_at") else "",
                ]
                if part
            )
        )

    return "\n\n".join(blocks)


def generate_articles(items: list[dict]) -> dict:
    api_key = read_env("GEMINI_API_KEY")
    model = read_env("GEMINI_MODEL", "gemini-1.5-pro")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required")

    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    response = requests.post(
        endpoint,
        headers={"Content-Type": "application/json"},
        json={
            "generationConfig": {"temperature": 0.7, "responseMimeType": "application/json"},
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                'Write a JSON object with an "articles" array. '
                                'Each article must include title, full_article_markdown, meta_description, and suggested_image_query. '
                                'full_article_markdown must include sections titled Why, Impact, and Solutions. '
                                'Use the supplied RSS context to inform the content. '
                                'Do not wrap the JSON in markdown fences.\n\n'
                                + format_rss_items(items)
                            )
                        }
                    ]
                }
            ],
        },
        timeout=60,
    )
    response.raise_for_status()

    data = response.json()
    text = data["candidates"][0]["content"]["parts"][0].get("text", "")
    if not text:
        raise RuntimeError("Gemini response did not include text")

    payload = json.loads(strip_json_fence(text))
    articles = payload.get("articles", [])

    if not isinstance(articles, list):
        raise RuntimeError("Gemini response must contain an articles array")

    normalized_articles: list[dict] = []

    for article in articles:
        if not isinstance(article, dict):
            continue

        title = str(article.get("title", "")).strip()
        full_article_markdown = str(article.get("full_article_markdown", "")).strip()
        meta_description = str(article.get("meta_description", "")).strip()
        suggested_image_query = str(article.get("suggested_image_query", "")).strip()

        if not title or not full_article_markdown or not meta_description or not suggested_image_query:
            continue

        normalized_articles.append(
            {
                "title": title,
                "full_article_markdown": full_article_markdown,
                "meta_description": meta_description,
                "suggested_image_query": suggested_image_query,
            }
        )

    if not normalized_articles:
        raise RuntimeError("Gemini returned no valid articles")

    return {"articles": normalized_articles}


def enrich_images(payload: dict) -> dict:
    access_key = read_env("UNSPLASH_ACCESS_KEY")

    if not access_key:
        return payload

    for article in payload.get("articles", []):
        if article.get("image_url"):
            continue

        response = requests.get(
            "https://api.unsplash.com/photos/random",
            params={"query": article.get("suggested_image_query", "climate"), "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {access_key}"},
            timeout=60,
        )
        response.raise_for_status()
        article["image_url"] = response.json().get("urls", {}).get("regular", "")

    return payload


def write_output(payload: dict) -> Path:
    output_path = Path(read_env("AUTOMATION_OUTPUT_PATH", "public/generated/climate-feed.json"))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return output_path


def main() -> None:
    rss_items = fetch_rss_items()
    payload = generate_articles(rss_items)
    payload = enrich_images(payload)
    payload["sources"] = rss_items
    output_path = write_output(payload)
    print(f"Wrote generated climate feed to {output_path}")


if __name__ == "__main__":
    main()