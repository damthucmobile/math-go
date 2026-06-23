# Simple CMS — Next.js Headless CMS & Marketing Site

A **content-first** headless CMS and marketing site built with **Next.js 16**, the App Router, and a file-based data layer. Built to demonstrate production-ready patterns: admin auth, block-based editing, configurable content types, and a secure, fast public site.

---

## Overview

This project is a full-stack Next.js application that combines:

- **Public marketing site** — Dynamic homepage, pages, and blog with server-rendered content and reusable section components.
- **Admin panel** — Protected dashboard for managing content, media, settings, and homepage with a block editor (Editor.js).
- **Configurable CMS** — JSON-driven content types (homepage, pages, posts, components) defined in `pages.json`; no database required for the core flow.

It showcases **App Router** patterns, **proxy**-based auth, **Route Handlers** for a minimal API, **caching** with `unstable_cache`, and a **component + block** rendering system for flexible page building.

---

## Project Preview

| Link | URL |
|------|-----|
| **Front** | [https://simple-cms-iota.vercel.app/](https://simple-cms-iota.vercel.app/) |
| **Admin** | [https://simple-cms-iota.vercel.app/admin](https://simple-cms-iota.vercel.app/admin) |

**Admin login:** Username `admin` · Password `password`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| **Language** | TypeScript |
| **Rich content** | [Editor.js](https://editorjs.io/) (block editor), isomorphic DOMPurify for sanitization |
| **Auth** | Cookie-based sessions with [jose](https://github.com/panva/jose) (JWT), Edge-compatible |
| **Content** | File-based JSON (`data/`), config in `pages.json` |

---

## Features

- **App Router** — Route groups `(site)` and `admin`, layouts, loading and error boundaries, `not-found`.
- **Proxy** — Protects `/admin` (except login) and API mutating routes; supports cookie session and optional `Authorization: Bearer` for server-to-server.
- **Admin** — Login, dashboard, CRUD for configurable tables (homepage, pages, posts, components), media library, settings, homepage editor with block-based body.
- **Block editor** — Editor.js integration with paragraph, header, list, quote, code, image, embed, delimiter; blocks stored as JSON and rendered via `BlockRenderer` + section components.
- **Section system** — Reusable “components” (Hero, CTA, Pricing, FAQs, etc.) referenced by ID from pages/posts; data passed via context (e.g. title, body, `sectionData`).
- **Security** — CSP and security headers in `next.config.ts`, sanitized rich text, file-based locking for concurrent writes.
- **Caching** — `unstable_cache` for CMS config and table data to limit disk reads.

---

## Project Structure

```
├── app/
│   ├── (site)/              # Public site: home, pages, posts
│   ├── admin/               # Admin UI: login, dashboard, CMS, media, settings
│   ├── api/                 # Route Handlers: auth, cms, media, settings
│   ├── components/          # BlockRenderer, ComponentRenderer, RichContent, Oatmeal UI
│   ├── layout.tsx
│   ├── error.tsx, not-found.tsx, loading.tsx
├── lib/                     # cms, auth, auth-edge, file-lock, media, sanitize, etc.
├── data/                    # JSON content (homepage, pages, posts, components, media, settings)
├── pages.json               # CMS table definitions
├── proxy.ts                 # Auth and API protection (Edge)
└── next.config.ts           # CSP, security headers, image config
```

---

## Getting Started

**Prerequisites:** Node.js 18+.

```bash
# Install dependencies (this also creates data/ and default JSON files if missing)
npm install

# Run development server
npm run dev
```

The `data/` directory and default JSON files (homepage, components, pages, posts, settings, media) are **not** in the repo. They are created automatically when you run `npm install` **locally** (via `postinstall`). On Vercel the seed step is skipped — production uses Vercel Blob. To create or restore data files manually, run `npm run seed`.

- **Site:** [http://localhost:3000](http://localhost:3000)  
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (login required)

### Environment (optional)

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_ADMIN_PATH` | Admin base path (default: `/admin`) |
| `API_SECRET` | Bearer token for server-to-server API mutations |
| `SESSION_SECRET` | Secret for signing session cookies (required for login) |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel Deploy Hook URL — when set, a new deployment is triggered after content is saved in admin (CMS, settings, media). Create in Vercel → Project → Settings → Git → Deploy Hooks. |
| `BLOB_READ_WRITE_TOKEN` | On **Vercel only**: when set (create a Blob store in Vercel → Storage → Blob), CMS data, settings, and media use Vercel Blob. Required on Vercel for admin saves (serverless fs is read-only). Ignored locally. |

**Storage:** Local dev always uses the `data/*.json` files (and `public/uploads/` for media). On Vercel, when `VERCEL=1` and `BLOB_READ_WRITE_TOKEN` is set, the app uses Vercel Blob for all CMS data, settings, and media so admin saves work.

For local dev, a default session secret is used if `SESSION_SECRET` is not set (see `lib/auth.ts` / `lib/auth-edge.ts`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Highlights for Next.js

- **Server Components** by default; client components only where needed (admin forms, editor, modals).
- **Streaming** — `Suspense` and loading states for data-heavy views.
- **Route Handlers** — REST-style `/api/cms/[tableId]`, `/api/auth/*`, `/api/media`, `/api/settings` with proper method checks and auth.
- **Edge-safe auth** — Session verification in proxy using `jose` and cookies.
- **Metadata** — Root layout `metadata` for SEO.
- **Security** — CSP, X-Frame-Options, and related headers configured in `next.config.ts`.

---

## Contact / Hire Me

Open to freelance and full-time opportunities in frontend, eCommerce, and conversion-focused development.

| Link | Description |
|------|-------------|
| [**Linktree**](https://linktr.ee/gaurangzalariya) | All links — portfolio, blog, booking, and more |
| [**LinkedIn**](https://www.linkedin.com/in/gaurangzalariya/) | Connect and message |
| [**Upwork**](https://www.upwork.com/freelancers/garyzalariya) | Hire me for your project |

---

## License

Private / portfolio use.

---

*Built with Next.js to demonstrate full-stack, content-driven applications with a clean separation between public site and admin, and a file-based CMS that can be swapped for a database or external API later.*
