# walshie4.github.io

Adam Walsh's personal site and blog. Live at <https://walshie4.github.io>.

## Layout

- `blog/` — the Astro source project: content, layouts, components. Edit here.
- Repo root — the compiled static output that GitHub Pages serves, committed directly.
  `.nojekyll` keeps Pages from running Jekyll over the build.

## Develop

```bash
cd blog
npm install
npm run dev      # local dev server
npm run build    # compile into the repo root, which is what gets published
```

`npm run gen-hash <password>` prints the hash used by `PUBLIC_PASSWORD_HASH` in
`blog/.env`.
