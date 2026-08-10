Terminal-themed personal site built with React, TypeScript, Vite, and Tailwind CSS.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run typecheck
npm run build
npm run preview
```

The production build includes a `404.html` fallback so React Router can preserve
clean URLs on GitHub Pages.

## Layout

```text
src/components/       reusable React UI
src/pages/            route-level page components
src/content/writing/  Markdown posts → /writing/[slug]
src/data/site.ts      editable copy & project links
src/lib/content.ts    typed Markdown loading and frontmatter parsing
src/styles/index.css  Tailwind entry point
```

## License

All rights reserved. Public for reference — no copying or redistribution without permission.
