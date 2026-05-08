# Climate Change Awareness Portal

Premium Next.js App Router build for climate reporting, live data display, and automated content generation.

## Folder Structure

```text
app/
  api/reports/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  climate-portal.tsx
lib/
  content.ts
  gemini-schema.ts
  news.ts
scripts/
  climate_automation.py
.github/workflows/
  climate-automation.yml
```

## Tech Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- RSS-driven content ingestion from NASA and IPCC feeds
- Gemini JSON schema parsing for climate articles
- Python automation for GitHub Actions

## Environment Variables

Create a `.env.local` file from `.env.example` and provide:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `UNSPLASH_ACCESS_KEY`
- `UNSPLASH_COLLECTION_ID`
- `NASA_CLIMATE_RSS_URL`
- `IPCC_RSS_URL`
- `RSS_FEED_LIMIT`
- `NEXT_PUBLIC_SITE_URL`
- `AUTOMATION_OUTPUT_PATH`

## Setup

1. Install dependencies with your preferred package manager.
2. Copy `.env.example` to `.env.local` and fill in the keys.
3. Run `npm run dev`.

## Automation

The Python script in `scripts/climate_automation.py` pulls NASA and IPCC RSS items, sends them to Gemini, validates the structured article JSON, enriches articles with Unsplash images, and writes `public/generated/climate-feed.json`.

## GitHub Action

1. Add `GEMINI_API_KEY`, `UNSPLASH_ACCESS_KEY`, `NASA_CLIMATE_RSS_URL`, and `IPCC_RSS_URL` as repository secrets.
2. Keep the scheduled workflow in `.github/workflows/climate-automation.yml` enabled.
3. The action runs daily, regenerates the feed, and commits the updated JSON back to the repo.
