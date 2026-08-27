# [stanleycheung.com](http://stanleycheung.com)

A personal site built from scratch. Four pages, one post template, and a footer. The site is a quiet place to read, not a portfolio dashboard.

## Goal

Ship a static site at `stanleycheung.com` where:

- Writing is the main reason to visit.
- Home introduces Stanley Cheung in a few sentences and points to recent posts.
- Projects and experience exist as their own pages, not as home-page sections.
- The look is warm paper, serif type, and almost no chrome.

Success is a stranger who can read a post comfortably, then find who you are and what you have shipped without hunting.

## Constraints

- Light theme only.
- No client-side routing. Every URL is a real page.
- No side nav, bottom nav, hamburger, cards, shadows, glass, or background grids.
- JavaScript is allowed for the theme toggle, the home-name tap flip, and post math or diagrams. The rest of the site is HTML and CSS.
- Contact is not a page. GitHub, LinkedIn, and email live in the footer on every page.
- Custom domain: `stanleycheung.com`. Deploy from `main` to GitHub Pages. This branch is `design-revamp` and does not deploy until merged.

## Stack

| Piece     | Choice                                                       | Why                                                                               |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Framework | Astro 5                                                      | Content-first static pages. Markdown is a first-class route, not a runtime parse. |
| Language  | TypeScript                                                   | Typed content collections and components.                                         |
| Styling   | Tailwind CSS 4                                               | Utility styles for a small site. Tokens live in one CSS file.                     |
| Posts     | Astro content collections + Markdown                         | Frontmatter is validated. Body is ordinary Markdown.                              |
| Math      | `remark-math` + `rehype-katex`                               | Used in technical posts.                                                          |
| Diagrams  | Mermaid, loaded only on pages that contain a `mermaid` fence | Avoid shipping the library on every page.                                         |
| Fonts     | Source Serif 4 (UI + prose), IBM Plex Mono (code only)       | Google Fonts, two families.                                                       |
| Hosting   | GitHub Pages                                                 | Existing domain and workflow. Build output is `dist/`.                            |
| Node      | 22                                                           | Matches the Pages runner.                                                         |

Do not add React. Do not add a SPA router. If a diagram needs a client island, use a small Astro client script, not a framework.

## Visual system

### Color

Cream paper, warm ink, rust links.

```css
:root {
  --paper: #f6f0e6;
  --paper-deep: #efe6d8;
  --ink: #2a241c;
  --muted: #6f6456;
  --faint: #8a7d6e;
  --rule: #ddd2c3;
  --accent: #9a3b24;
  --accent-hover: #7c2e1c;
  --accent-soft: rgb(154 59 36 / 12%);
  --code-bg: #2a241c;
  --code-fg: #f6f0e6;
}
```

- Page background is `--paper`.
- Body text is `--ink`.
- Dates, summaries, and captions are `--muted`.
- Dividers are 1px `--rule`.
- Links and focus rings are `--accent`. Hover is `--accent-hover` plus an underline.
- Selection background is `--accent-soft`.
- Code blocks invert to `--code-bg` / `--code-fg`. Inline code stays on paper: a hairline `--rule` border and a `--paper-deep` fill.

`theme-color` and the favicon background follow `--paper`.

### Type

Load from Google Fonts:

- Source Serif 4: 400, 400 italic, 600. Used for nav, headings, body, and UI.
- IBM Plex Mono: 400, 500. Used for `code`, `pre`, and nowhere else.

Scale:

| Role                      | Size                                                   | Notes                               |
| ------------------------- | ------------------------------------------------------ | ----------------------------------- |
| Site name in nav          | 1rem, weight 600                                       | Not a logo. It is text.             |
| Page title                | 2.5rem, weight 600, line-height 1.15, tracking -0.02em | 2.75rem from `sm` up.               |
| Post title                | 2.25rem, same treatment                                | Slightly smaller than a page title. |
| Section heading           | 1.25rem, weight 600                                    |                                     |
| Body                      | 1.1875rem, line-height 1.7                             |                                     |
| Meta (dates, nav, footer) | 0.9375rem, `--muted`                                   |                                     |
| Code                      | 0.875em of the surrounding size                        |                                     |

Post measure is `48rem`. Listing pages, nav, and footer use the same max width.

### Layout

- One centered column. Horizontal padding `1.25rem`, `1.5rem` from `sm` up.
- Sticky top nav: site name on the left, four links on the right. A 1px `--rule` under the nav. No blur, no background other than `--paper`.
- Current page: `--ink` plus a rust underline. Other links: `--muted`, underline on hover.
- Main padding: `3rem` top, `4rem` bottom.
- Footer: 1px rule, then copyright and the three contact links in one row. `--muted`, small type.
- Vertical rhythm: `3rem` between major blocks on a page. `1.5rem` between a title and its lede.

### Motion

None, except link color and underline, and a 3D flip of the given name in the home greeting. Honor `prefers-reduced-motion`: skip the rotate and swap the text. Focus states are a 2px rust outline with offset.

## Information architecture

```
/                 Home
/writing          Writing index
/writing/[slug]   Post
/projects         Projects
/experience       Experience
/404              Not found
```

Global nav, in this order: Home, Writing, Projects, Experience.

The site name in the nav always goes to `/`.

There is no `/work`, no `/contact`, and no hash sections that double as pages.

## File tree

```text
public/
  favicon.svg
  CNAME                    # stanleycheung.com
src/
  content.config.ts        # writing collection
  content/writing/         # one folder per post
    evaluate-division/
      index.md
      evaluate-division.png
  layouts/Base.astro       # html, fonts, nav, footer, page title
  pages/
    index.astro
    writing/index.astro
    writing/[slug].astro
    projects.astro
    experience.astro
    404.astro
  components/
    Nav.astro
    Footer.astro
    PostList.astro
    ProjectList.astro
    ExperienceEntry.astro
    Prose.astro            # article styles for Markdown output
    Mermaid.astro          # client island for mermaid fences
  styles/global.css        # tokens + Tailwind + base
  data/site.ts             # name, blurb, links, projects, experience
astro.config.ts
tsconfig.json
package.json
.github/workflows/deploy.yml
.gitignore
README.md
```

Keep site copy that is not a post in `src/data/site.ts`. Keep posts in the content collection. Do not mix the two.

Site-wide files (favicon, CNAME) stay in `public/`. Anything that belongs to a post does not.

## Content model

### Site data (`src/data/site.ts`)

```ts
export const site = {
  name: "Stanley Cheung",
  givenName: "Stanley",
  legalGivenName: "Yin",
  familyName: "Cheung",
  shortName: "Cheuyin",
  homeGreetingPrefix: "Hi 👋, I'm",
  role: "Software engineer and CS student at UBC",
  tagline:
    "I write about building software, and I ship products with agent systems.",
  writingBlurb:
    "Notes on projects, debugging, and things I am still figuring out.",
  url: "https://stanleycheung.com",
  links: {
    github: "https://github.com/cheuyin",
    linkedin: "https://www.linkedin.com/in/yinstanleycheung/",
    email: "mailto:yinstanleycheung@gmail.com",
  },
} as const;
```

Use `name` in the footer and document title. Use `homeGreetingPrefix` plus `givenName` in the home heading. `legalGivenName` is the hover and tap face of the given name. The rest of the greeting stays put. Use `shortName` only in the document title suffix if the full name is already in the page title.

The home intro lives in `intro`, a list of paragraphs. Each paragraph is a list of `IntroSegment` values, where a segment carries an optional `href` so a phrase can become a link. Keep markup out of the copy; a segment is plain text and a URL, never HTML.

### Writing collection

Schema:

- `title`: string
- `date`: date (ISO in frontmatter)
- `summary`: string
- `tags`: array of strings, default `[]`
- `draft`: boolean, default `false`

Each post is a folder. The folder name is the slug. The Markdown file is always `index.md`. Related files live next to it.

```text
src/content/writing/{slug}/
  index.md
  *.png | *.jpg | *.svg | *.gif   # figures used in the post
```

Do not put a lone `src/content/writing/{slug}.md` beside a folder of the same name. Do not dump post images into `public/`. A post you delete or rename should take every related file with it.

In Markdown, images are relative to `index.md`:

```md
![LeetCode 399: Evaluate Division](./evaluate-division.png)
```

The collection glob is `**/index.md`. The slug is the parent folder name, not `index`. List pages skip `draft: true`. Sort by `date` descending.

Markdown supports GFM, `$math$` / `$$math$$`, relative images, and fenced `mermaid` blocks.

### Projects

Each item: `title`, `summary`, `href` (GitHub for now).

1. CreateYourStory.ai — Choose-your-own-adventure story generator with a Python backend, branching narratives, and a live demo on Render. `https://github.com/cheuyin/createyourstory.ai`
2. Local AI Coding Agent — Terminal coding agent using Gemini that can read, write, and run files in a sandboxed workspace. `https://github.com/cheuyin/ai-agent-python`
3. AutoDater — Obsidian plugin that keeps Created and Updated dates in Markdown frontmatter up to date. TypeScript, zero config. `https://github.com/cheuyin/autodater`

### Experience

Each item: `role`, `company`, `location`, `dates`, `startDate`, `stack`, `highlights[]`.

One entry for v1:

- Role: Software Engineer Intern
- Company: VoltSafe Inc.
- Location: Vancouver, BC
- Dates: Jan 2024 – Oct 2024
- Stack: TypeScript · Express.js · PostgreSQL · AWS · React
- Highlights:
  - Built permissions for an internal admin dashboard so staff only saw what they were allowed to.
  - Set up live monitoring across 7+ servers so the team could catch issues early.
  - Added file storage to a marina app and cut bandwidth costs.
  - Made the frontend 22% smaller and faster to load by cleaning up unused assets.

## Pages

Every page uses `Base.astro`. Pass `title` and `description` for `<title>` and meta. Document title is `{page title} · Stanley Cheung`, except home, which is `Stanley Cheung`.

### Home `/`

No page-title heading other than the name.

1. `h1`: Hi 👋, I'm Stanley. Hover or tap to flip only `Stanley` to `Yin`. The greeting prefix does not move. The hit box stays as wide as the rest state so the name can flip without dropping hover or shrinking the line. On a phone, tap toggles and stays until you tap again. The accessible heading remains Hi 👋, I'm Stanley.
2. One line in `--muted`: Software engineer and CS student at UBC.
3. Tagline in body size, max-width the home column.
4. Intro paragraphs from `intro`, same body size and rhythm as the tagline. The copy is a short history, not a résumé, and it ends on why the site exists.
5. Heading `Writing`, then the three latest posts via `PostList`. A text link under the list: “All writing”.
6. Two sentences as links, not sections: “See projects” and “See experience”.

Do not repeat project summaries or job bullets here. Do not put contact CTAs here.

### Writing `/writing`

1. `h1`: Writing.
2. `writingBlurb` as the lede.
3. Full `PostList`. If empty: “No posts yet.”

A list row is: title (serif, weight 600), date on the right on wide screens, summary under the title. Rows separated by a top hairline. The whole row is a link to the post. Tags are omitted on list pages.

### Post `/writing/[slug]`

1. Text link: “Writing”, pointing at `/writing`.
2. `h1`: post title.
3. Date as `<time datetime>`. Tags as plain muted words, not chips, only if present.
4. Summary as a lede in `--muted`.
5. Hairline.
6. Body in `Prose.astro`, measure `48rem`.

Prose rules:

- Headings, paragraphs, lists, and blockquotes are Source Serif 4.
- Links are rust, underline on hover.
- Blockquote: left 2px rust rule, muted text.
- Images: full measure, no border, caption centered in muted small type if `alt` is present.
- Tables: hairline rules, body size down one step.
- Mermaid: render to SVG, centered, no extra frame.

Unknown slugs go to 404.

### Projects `/projects`

1. `h1`: Projects.
2. One sentence: “Things I have shipped.”
3. List: title as an external link, summary under it, “GitHub” as a muted text link if the title already states the name. Open in a new tab with `rel="noreferrer"`. Hairline between rows.

### Experience `/experience`

1. `h1`: Experience.
2. For each role: role as heading, company and location on the next line, dates and stack in muted type, then a disc list of highlights. Marker color is `--accent`. Hairline between roles.

### 404

1. `h1`: Page not found.
2. One sentence and a link to home.

## Components

- `Nav.astro` — reads the current path from Astro and sets `aria-current="page"`.
- `Footer.astro` — `© {year} Stanley Cheung` plus GitHub, LinkedIn, Email.
- `PostList.astro` — accepts an array of posts. Used on home (sliced) and the writing index.
- `ProjectList.astro` — maps `site` projects.
- `ExperienceEntry.astro` — one role.
- `Prose.astro` — a `div` with article styles. No `@tailwindcss/typography` unless it is faster than writing twenty lines of CSS. Prefer explicit prose classes so the type scale stays exact.
- `Mermaid.astro` — `client:visible`. Replaces each mermaid fence during post render.

Shared list rows should look like the same component family even if they are three files. Same padding (`1.5rem` vertical), same hairline, same title size.

## Writing pipeline

In `astro.config.ts`:

- `remark-gfm`
- `remark-math`
- `rehype-katex`

In the post page, map `pre > code.language-mermaid` to `Mermaid.astro`. Leave other fences as highlighted or plain code. Syntax highlighting can be Shiki with a warm-dark theme, or unstyled mono on `--code-bg`. Do not introduce a second accent color inside code.

KaTeX CSS is imported only on the post layout, not globally.

First post to include at launch: _Solving LeetCode's Evaluate Division_ (`src/content/writing/evaluate-division/`, date 2026-08-26, tags `leetcode`, `algorithms`, `python`, `graphs`). The post body and `evaluate-division.png` already exist in git history on `main`. Recover both from `main` rather than rewriting the post, then move the image into that folder and point the Markdown at `./evaluate-division.png`.

## Chrome and meta

- `index.html` is not hand-written. Astro emits it from `Base.astro`.
- Favicon: a simple serif “S” or a rust mark on cream. SVG.
- Open Graph: title, description, `og:type` article on posts and website elsewhere. No social image required for v1.
- `lang="en"`.
- `CNAME` in `public/` so Pages serves `stanleycheung.com`.

## Deploy

`.github/workflows/deploy.yml`:

- Trigger: push to `main`, plus `workflow_dispatch`.
- Node 22, `npm ci`, `npm run build`.
- Upload `dist` with `actions/upload-pages-artifact` and `actions/deploy-pages`.

Scripts:

- `dev`: `astro dev`
- `build`: `astro build`
- `preview`: `astro preview`

`.gitignore`: `dist/`, `node_modules/`, `.env*`, `.DS_Store`, `.astro/`.

README: one paragraph of what the site is, then the three npm scripts. Point at this file for design.

## Implementation order

Build in this sequence. Do not skip ahead to posts until the shell is right.

1. Scaffold Astro + TypeScript + Tailwind. Add fonts and `global.css` tokens. Confirm cream paper in the browser.
2. `site.ts` with copy, links, projects, and experience.
3. `Base.astro`, `Nav.astro`, `Footer.astro`. Stub four routes with titles only. Check nav `aria-current` and mobile wrapping.
4. Home, Projects, Experience with real lists. No Markdown yet.
5. Content collection, writing index, post template, prose styles.
6. KaTeX, Mermaid, and the first post plus image.
7. 404, favicon, CNAME, Pages workflow, README.
8. Walk every route at desktop and a ~375px viewport. Keyboard through the nav. Read the post end to end.

Stop when the eight steps are done. Do not add dark mode, RSS, tags-as-pages, or a CMS.

## Out of scope

- Dark mode
- Search, RSS, analytics
- Tag index pages
- Project case-study pages
- A contact form
- Animation libraries
- React, Vue, or a client router
