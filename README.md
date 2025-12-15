# Carvauto (MVP)

Carvauto is a buy-box + valuation workflow app for dealership vehicle acquisition.

This MVP provides:
- Buy List dashboard with filters
- Listing detail view
- Clean-title-only enforcement (default)
- VIN extraction from title/description (masked + hash)
- Boolean flags for license plate / VIN label / VIN text in images
- Supabase/Postgres schema
- Netlify serverless functions for search + detail endpoints
- Ingestion service scaffold (runs outside Netlify)

## Architecture
- Front-end: Vite + React (deployed on Netlify)
- API: Netlify Functions (read/query + optional lightweight writes)
- Database: Supabase Postgres
- Ingestion/Enrichment: separate service (Render/Cloud Run/etc.)

## Local Development
1. Create a Supabase project
2. Run SQL in `sql/001_schema.sql`
3. Create env file: `app/.env` (see `.env.example`)
4. Install and run the app:

```bash
cd app
npm i
npm run dev
