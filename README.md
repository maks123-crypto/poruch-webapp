# Poruch Mini App (Telegram WebApp)

Day-1 scaffold of the Mini App direction: the bot stays for delivery and
reminders, while the Mini App becomes the pretty face — library, reader,
later voice recording with a waveform and the Stars paywall.

This first cut is **plain static files, no build step and no dependencies**,
so it cannot break the monorepo build and any static host can serve it.
When it grows screens and real API calls we migrate it to React + Vite in
this same folder.

## What works now

- **Library** — list of recent stories (embedded samples for now).
- **Reader** — the "comfortable reading" answer to Telegram's tiny messages:
  serif font, generous line height, A−/A+ font size (persisted locally),
  warm dark theme matched to the pitch deck, Telegram theme vars respected.
- Telegram integration: `tg.ready()/expand()`, native BackButton.

## Try it locally

Open `apps/webapp/index.html` in a browser — everything works outside
Telegram too (the `tg` calls are skipped).

## Wire it into the bot (when we host it)

1. Host this folder on any static HTTPS host (Vercel/Netlify/Cloudflare Pages).
2. BotFather → `/newapp` (or bot menu button) → point it at the URL.
3. Next step in code: replace `SAMPLE_STORIES` with a `GET /api/stories`
   backed by Supabase, authenticated with Telegram `initData` validation
   (hash check with the bot token — never trust raw query params).

## Planned screens (from the spec, Доповнення v1.1 §E)

- onboarding, voice recording with waveform + timer
- story library with covers, player for narrated stories
- paywall via Telegram Stars
