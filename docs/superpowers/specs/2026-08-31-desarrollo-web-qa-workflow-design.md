# Diseño: Workflows de Desarrollo Web/3D y QA/Código Limpio

Fecha: 2026-08-31
Estado: aprobado por Krisix, pendiente de plan de implementación

## Contexto

[[Agencia de Mantenimiento Web con IA]] (marca: Anclora) define 7 departamentos agénticos. El protocolo genérico de departamento (orquestador + trabajadores, pipeline de 7 fases, bucle de fallo, Mesa Redonda) ya está especificado en `Knowledge/Arquitectura de Departamentos - Agencia IA.md` del vault, pero ningún departamento tiene todavía una implementación ejecutable. Este documento diseña la primera: **Desarrollo Web/3D** (el departamento que ya tiene trabajo real pendiente sobre el sitio Anclora) y, como dependencia dura de su fase de verificación, **QA/Código Limpio**.

Repo de código: `E:\agencia-web\portfolio` (GitHub: `lethalkrisix/agencia-web-portfolio`), separado del repo del vault. Este spec y su plan de implementación viven en este repo, no en el vault.

## Objetivo

Que Krisix pueda escribir `/desarrollo-web "<tarea>"` en este repo y que el encargo se ejecute de principio a fin — planificación, reparto a trabajadores especializados, verificación de QA real, y entrega — sin que él tenga que orquestar manualmente cada paso, pero sin que nada llegue a producción sin su confirmación explícita.

Primer caso real de uso: pulir, verificar y dejar listas para producción las 6 secciones de la home de Anclora ya escritas en local pero sin commitear (`contact.tsx`, `cursor.tsx`, `footer.tsx`, `magnetic-button.tsx`, `marquee.tsx`, `process.tsx`, `services.tsx`, `stats.tsx`) más los cambios pendientes en `globals.css`, `layout.tsx`, `page.tsx`, `hero-scene.tsx`, `hero.tsx`, `nav.tsx`.

## No-objetivos (fuera de alcance de este spec)

- Los otros 5 departamentos (Prospección, Marketing, Finanzas, Ventas, Analíticas) — se diseñan aparte cuando les toque.
- El dashboard web de estado en tiempo real — sigue pendiente en el vault, no se resuelve aquí. El "informe" de este workflow se escribe al vault en el mismo formato que ya usan las sesiones de desarrollo manuales, para que sea consumible por el dashboard el día que exista, sin construir nada especulativo ahora.
- Mesa Redonda — este es trabajo rutinario de un solo departamento con dependencia directa (QA), no cruza varios departamentos de negocio ni tiene impacto de negocio: no se convoca.
- Ejecución programada/recurrente (cron) — el trigger sigue siendo manual (`/desarrollo-web`), no se automatiza un disparo periódico.

## Arquitectura

Dos Workflows de Claude Code, guardados como scripts en el repo, cada uno con su propio comando slash:

```
E:\agencia-web\portfolio\.claude\
  workflows\
    desarrollo-web.js
    qa-codigo-limpio.js
  commands\
    desarrollo-web.md
    qa-codigo-limpio.md
```

`desarrollo-web` invoca a `qa-codigo-limpio` como sub-workflow (`workflow('qa-codigo-limpio', {...})`) en su fase de verificación — QA sigue siendo un departamento independiente e invocable por sí solo, no un atajo dentro de Desarrollo. La composición de workflows solo permite un nivel de anidamiento, lo cual es suficiente aquí (no hay un tercer nivel).

Elegido explícitamente sobre subagentes nativos interactivos (ver decisión de Krisix, 2026-08-31): el pipeline corre en segundo plano como script determinista de la herramienta Workflow. Esto tiene una implicación de diseño importante: **el workflow no puede detenerse a media ejecución a preguntarle algo a Krisix** — el bucle de fallo tiene que ser acotado y autónomo, y el resultado final siempre es un informe claro (éxito o bloqueo), nunca una pregunta pendiente en el aire.

## Reparto de modelos (decisión explícita de Krisix, 2026-08-31)

- **Opus** — todo paso de orquestador/decisión: planificación (fase 1 de Desarrollo), síntesis del veredicto de QA, integración final. Necesita precisión, no volumen de tokens.
- **Sonnet** — trabajo de código real: `frontend-developer`, `backend-architect`, la revisión visual/funcional y de accesibilidad dentro de QA.
- **Haiku** — pasos mecánicos sin criterio que ejercer: correr `npm run build` / `npm run lint` y reportar la salida tal cual.

## `desarrollo-web.js`

Fases (`meta.phases`): Intake y Plan → Desarrollo → QA → Entrega.

1. **Intake y Plan** (1 agente, Opus, `agentType` por defecto — necesita herramientas de repo: `Read`/`Grep`/`Glob`/`Bash` para `git status`/`git diff`). Recibe la tarea vía `args.tarea`. Lee el estado real del repo (working tree, no memoria) y produce un plan estructurado (schema): lista de encargos autocontenidos (archivo(s), qué debe cambiar, criterio de aceptación) por trabajador — `frontend` y/o `backend` — y qué debe revisar QA específicamente. Sigue el principio "pensar antes de programar" de `andrej-karpathy-skills`: si la tarea es ambigua, el plan debe reflejar la interpretación elegida explícitamente, no adivinar en silencio y desaparecer la ambigüedad.

2. **Desarrollo** (`pipeline()` sobre los encargos del plan, Sonnet, `agentType: 'frontend-developer'` / `agentType: 'backend-architect'` según corresponda). Cada trabajador recibe su encargo autocontenido (contexto completo, no un resumen — regla de `subagent-driven-development`) y trabaja sobre los archivos indicados. Si el plan no asignó trabajo de backend (caso esperado para este primer encargo — es una página estática de marketing, sin API/DB), esa rama del pipeline no se ejecuta.

3. **QA** (`await workflow('qa-codigo-limpio', {alcance: <archivos tocados por la fase 2>})`). Devuelve el veredicto estructurado de `qa-codigo-limpio.js` (ver más abajo).

4. **Bucle de fallo** (dentro del script, plain JS, sin agente): si el veredicto es `fail`, se reenvía el encargo al trabajador responsable de cada incidencia con el motivo concreto (re-briefing — no se reasigna a un trabajador distinto en este primer caso porque solo hay un rol relevante, frontend). Máximo **2 rondas** de reintento. Si tras 2 rondas sigue en `fail`, el workflow **para sin commitear** y el resultado final es un informe de bloqueo (qué falló, qué se intentó, qué decisión hace falta) — nunca decide por su cuenta algo que le corresponde a Krisix (cambiar de enfoque, aceptar una limitación, etc.).

5. **Entrega** (1 agente, Opus — es una decisión de aceptación final, no trabajo mecánico). Si QA aprobó: `git add` + `git commit` de los cambios (mensaje descriptivo del encargo) — **nunca `git push`**, eso queda para que Krisix (o Krisix contigo) lo confirme aparte. Luego escribe el informe de fase 7 al vault vía las herramientas MCP de Obsidian: entrada en `Dev Logs/` (formato `YYYY-MM-DD - Descripción.md`), actualización de la nota de proyecto `Agencia de Mantenimiento Web con IA.md` (sección Key Decisions o Recent Activity según corresponda), y mención en la nota diaria del día — seguir el mismo formato que ya usan las sesiones manuales de desarrollo, no inventar un formato nuevo (queda pendiente para cuando exista el dashboard, no se resuelve aquí).

## `qa-codigo-limpio.js`

Invocable como sub-workflow de `desarrollo-web`, y también suelto vía `/qa-codigo-limpio` para pasadas de QA ad hoc sobre el estado actual del repo. Recibe `args.alcance` (opcional: lista de archivos a enfocar; si no se pasa, revisa el estado completo del working tree).

Fases: Build y Lint → Verificación visual/funcional → Accesibilidad → Veredicto. Las tres primeras corren en paralelo (`parallel()`) porque son independientes entre sí y el veredicto final las necesita todas juntas (barrera justificada: es exactamente el caso "dedup/síntesis tras resultados independientes" del patrón de barrera correcta).

1. **Build y Lint** (Haiku): `npm run build` (production build real, no solo `next dev` — lección ya documentada en el vault del fallo de build de Vercel) + `npm run lint`. Reporta la salida cruda (schema: `{buildPassed, lintPassed, errors: string[]}`) sin interpretarla — es mecánico.
2. **Verificación visual/funcional** (Sonnet, con las skills `playwright-dev`/`webapp-testing` ya instaladas en el repo): levanta el sitio (o usa el build de la fase 1) y revisa visual y funcionalmente las secciones en `args.alcance`. Comprueba explícitamente que los efectos decorativos (cursor custom, marquee, contadores, scroll) siguen activos — recordatorio del vault: no hay gating por `prefers-reduced-motion` en Anclora, es una decisión ya tomada, no un bug a "corregir".
3. **Accesibilidad** (Sonnet, con `accessibility-compliance`): comprueba contraste, semántica, navegación por teclado — sin proponer apagar los efectos decorativos como solución (ver punto anterior).
4. **Veredicto** (Opus): sintetiza los 3 resultados en `{status: 'pass'|'fail', issues: [{severity, description, file}]}`. `fail` si build o lint fallan, o si hay algún issue de severidad alta en visual/accesibilidad.

## Comandos slash

- `.claude/commands/desarrollo-web.md`: recibe el texto del encargo como argumento, invoca `Workflow({name: 'desarrollo-web', args: {tarea: <texto>}})`. Esta invocación explícita por comando es en sí misma el opt-in requerido por la herramienta Workflow — no hace falta que Krisix diga "ultracode" cada vez.
- `.claude/commands/qa-codigo-limpio.md`: invoca `Workflow({name: 'qa-codigo-limpio', args: {}})` (revisión completa) directamente, sin pasar por Desarrollo.

## Seguridad / control humano

- Nunca se hace `git push` de forma autónoma, en ningún camino del workflow (éxito o fallo). El push a `main` (que auto-despliega en Vercel) queda siempre como paso manual posterior.
- El bucle de fallo tiene un tope duro (2 rondas) — nunca reintenta indefinidamente ni decide "aceptar" un resultado en `fail` por su cuenta.
- Cualquier ambigüedad de criterio detectada en la fase de Plan se refleja explícitamente en el plan (la interpretación elegida, no una elección silenciosa) para que Krisix pueda corregirla al revisar el informe final, en vez de descubrir una decisión no declarada después del hecho.

## Primer caso de prueba

Una vez implementado: `/desarrollo-web "revisa, pule y verifica las secciones de la home ya escritas (Marquee, Stats, Services, Process, Contact, Footer, cursor custom, magnetic-button) y los cambios pendientes en Hero/Nav/layout, y déjalas listas para producción"`. Resultado esperado: o bien un commit local limpio + informe en el vault listo para que Krisix apruebe el push, o un informe de bloqueo claro sobre qué falló.

## Pendiente (explícitamente fuera de este spec)

- Formato exacto y persistencia del informe de fase 7 para cuando exista el dashboard — se reutiliza el formato manual existente mientras tanto.
- Departamentos QA-adyacentes futuros (p.ej. si QA necesita su propio worker split cuando el trabajo crezca) — hoy QA es un solo rol porque el trabajo es de verificación, no de construcción con dos especialidades.
- Migrar `desarrollo-web`/`qa-codigo-limpio` a disparo programado (cron) — no hay volumen de clientes todavía que lo justifique.
