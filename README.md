## ⚠️ Workflow de la agencia (IMPORTANTE)

Este repo es el sitio Anclora, construido y mantenido a través del departamento **Desarrollo Web/3D** de la agencia. Diseño completo: `docs/superpowers/specs/2026-08-31-desarrollo-web-qa-workflow-design.md`.

- **Lanzar un encargo de desarrollo**: `/desarrollo-web "descripción del encargo"` — planifica, reparte a frontend/backend, verifica con QA, deja un commit local + informe en el vault. **Nunca hace `git push` por su cuenta** — el push a `main` (auto-despliega en Vercel) lo confirmas tú aparte.
- **Lanzar solo QA**: `/qa-codigo-limpio`.
- Si falla tras 2 rondas de reintento, para sin commitear y da un informe de bloqueo, no decide solo.

Estado (2026-08-31): diseño aprobado, comandos/scripts pendientes de implementar — comprobar que existen en `.claude/workflows/` y `.claude/commands/` antes de asumir que ya funcionan.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
