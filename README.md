# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/54159397-b7d1-48fe-9fe9-2311dc387f9d

## How can I edit this code?

There are several ways of editing your application.

<!--- 👋 Nice README header --->

# All Things AI

A curated directory and demo of modern AI tools — built with React, TypeScript, Vite, Tailwind CSS and shadcn-ui.

<!-- Badges -->
![vite](https://img.shields.io/badge/Vite-Blue?logo=vite&logoColor=white)
![react](https://img.shields.io/badge/React-17.0.0-blue?logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/TypeScript-4.0-blue?logo=typescript&logoColor=white)
![license](https://img.shields.io/badge/License-MIT-green)

One-liner: a fast, polished front-end for browsing, rating and comparing AI tools.

---

## What you'll find

- Pages: Home, Explore, Tool detail, Submit, Comparisons, Analytics, Admin dashboard
- Components: Tool cards, Filters, Top-rated & Trending sections, Navigation, Auth flow
- Integrations: Supabase (data + auth) scaffolded under `supabase/`

## Project structure (important)

- `src/` – React app
	- `components/` – UI components and shadcn-ui atoms
	- `pages/` – top-level route pages
	- `hooks/` – data + auth hooks
	- `integrations/supabase/` – Supabase functions and config

---

## Development tips

- Tailwind classes are used across components. Use the class names in `src/` when tweaking layout.
- Run the dev server, make changes, save — Vite updates instantly.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and push
4. Open a PR and describe the change briefly

If you want help with design or adding tests, open an issue and describe what you need.

---

## Notes & next steps

- I removed the Locomotive Scroll integration (smooth-scrolling) and debug components to restore native scrolling behavior.
- If you want the smooth-scroll behavior re-added later, I can re-integrate a lightweight, optional provider and styles.

---

### License

MIT — see `LICENSE` (if present) or add one as needed.

---

Happy hacking — open an issue or ping me if you want a specific README section (screenshots, roadmap, deploy details).
