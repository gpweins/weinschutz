# weinschutz.com.br

Personal portfolio site for Gustavo Weinschütz — Senior Software Engineer.

## Stack

Vue 3 + TypeScript + Vite + Tailwind v4, pre-rendered to static HTML via `vite-ssg`, deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev      # localhost:5173, hot reload
npm run build    # vite-ssg → dist/
npm run preview  # serve dist/ at localhost:4173
npm test         # vitest
```

## Adding a blog article

1. `cp content/blog/_template.md content/blog/<your-slug>.md`
2. Edit frontmatter (title, date required; excerpt, linkedinUrl, ogImage optional)
3. Write markdown body
4. (Optional) drop images in `public/images/blog/<your-slug>/`
5. `git commit -m "post: <slug>" && git push`
6. GitHub Actions deploys (~2 min)

## Deployment

Auto-deployed via GitHub Actions on push to `main`. See `.github/workflows/deploy.yml`.

DNS for `weinschutz.com.br`: A records → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
