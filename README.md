# Blogging Platform

A multi-site blogging platform with three components:

- **Server** (`server/`) — Deno/Hono API backend with JWT auth and RESTful endpoints
- **Public Panel** (`blogging-site-public-panel/`) — Next.js v16 (App Router) public-facing frontend for readers
- **Author Panel** (`blogging-site-author-panel/`) — React SPA (CRA) admin dashboard for authors and site managers

The platform supports managing multiple blogs/sites from a single dashboard, with features like rich text editing, category/tag management, navigation customization, social media links, and static pages. Currently a prototype using Pokemon-themed mock data.

## Tech Stack

| Component | Runtime | Framework | State/HTTP | Key Libs |
|---|---|---|---|---|
| Server | Deno 2+ | Hono | JWT, CORS | deno.json |
| Public Panel | Node.js | Next.js 16 (App Router) | Server Components | Tailwind, Framer Motion, Swiper |
| Author Panel | Node.js | React 18 (CRA) | Redux Toolkit, Axios | Formik, ReactQuill, Tailwind |

## Getting Started

### Server

```bash
cd server
deno run --allow-net --allow-read --allow-env main.js
```

### Public Panel

```bash
cd blogging-site-public-panel
npm install
npm run dev
```

### Author Panel

```bash
cd blogging-site-author-panel
npm install
npm start
```
