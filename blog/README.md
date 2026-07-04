# adam.walsh — personal blog

Static site built with [Astro](https://astro.build). Minimal, monospace, early-web aesthetic.

## Structure

```
src/
  content/
    blog/       ← public posts (markdown)
    private/    ← password-gated posts (markdown)
  pages/
    index.astro
    about.astro
    blog/
    private/    ← password protected
  components/
    PasswordGate.astro
  layouts/
    Layout.astro
  styles/
    global.css
```

## Setup

```bash
npm install
```

## Password for private section

1. Generate a hash for your chosen password:
   ```bash
   npm run gen-hash yourpassword
   ```

2. Copy `.env.example` to `.env` and paste the hash:
   ```
   PUBLIC_PASSWORD_HASH=<your hash here>
   ```

## Dev

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Works with Vercel, Netlify, Cloudflare Pages, or any static host.
Just point it at the `dist/` folder after `npm run build`.

## Writing posts

Drop `.md` or `.mdx` files into `src/content/blog/` (public) or `src/content/private/` (gated).

Frontmatter:
```yaml
---
title: "Post title"
date: 2026-06-20
description: "Optional summary"
tags: ["optional", "tags"]
draft: false
---
```
