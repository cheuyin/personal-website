---
title: How I built Node Films
date: 2026-03-18
summary: 'Project walkthrough: problem, approach, tradeoffs, and what I would do differently.'
tags: ['project', 'learning', 'node']
---

## The problem

I wanted a movie discovery app that felt fast without hiding how the data layer worked. The goal was not a polished product — it was to practice building a REST API in Node.js and wiring a frontend to it without a framework doing the glue for me.

The core question: can I fetch, transform, and display async data from an external API while keeping the backend and frontend cleanly separated?

## What I built

Node Films is a small full-stack app:

- **Backend** — Express server with routes for search and film details
- **Frontend** — vanilla HTML/CSS/JS calling the API with `fetch`
- **Data** — TMDB API for movie metadata

The split I aimed for:

```
Browser  →  GET /api/films?q=inception  →  Express  →  TMDB API
```

Each layer has one job. The frontend never talks to TMDB directly.

## Approach

I started with the API routes and tested them in isolation before touching the UI. That order mattered — when the frontend broke, I knew whether the bug lived in the route handler or the DOM code.

For async data, I used Promises throughout and kept error handling explicit:

```js
app.get('/api/films', async (req, res) => {
  try {
    const results = await tmdb.search(req.query.q);
    res.json(results);
  } catch (err) {
    res.status(502).json({ error: 'Upstream request failed' });
  }
});
```

Nothing fancy, but it forced me to think about failure modes early.

## What broke

The first version fetched film details one at a time in a loop. It worked on my machine with three results. It did not work when the search returned twenty.

Fix: batch the detail requests with `Promise.all` and cap concurrency. Obvious in hindsight — I only noticed because I tested with a broad search term instead of a specific title.

Second issue: CORS. I had the frontend on one port and the API on another during development. Spent twenty minutes staring at a blank page before remembering to add `cors` middleware.

## Tradeoffs

| Choice | Why | Cost |
|--------|-----|------|
| Vanilla JS frontend | Learn DOM APIs directly | More boilerplate than React |
| Express over Fastify | Familiar docs, huge ecosystem | Heavier than needed for this scope |
| No database | Movies are read-only from TMDB | Cannot save user data |

I would use a database if I added watchlists. For read-only search, caching responses in memory would be the next step before introducing Postgres.

## What I would do differently

1. **Write API tests first** — I tested manually with curl. Automated tests would have caught the N+1 fetch issue faster.
2. **Add a loading state earlier** — The UI felt broken during slow searches until I added a simple spinner.
3. **Type the API responses** — Even JSDoc typedefs would have saved time when TMDB returned unexpected null fields.

## Links

- [Repo on GitHub](https://github.com/cheuyin/node-films)
