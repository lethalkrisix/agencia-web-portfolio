# Workflow Desarrollo Web/3D + QA/Código Limpio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir los dos primeros departamentos ejecutables de la agencia (Desarrollo Web/3D y QA/Código Limpio) como Workflows de Claude Code invocables con `/desarrollo-web` y `/qa-codigo-limpio`, y usarlos para entregar el primer encargo real en espera (pulir/verificar/commitear las 6 secciones ya escritas de la home de Anclora).

**Architecture:** Dos scripts de Workflow guardados en el repo (`qa-codigo-limpio.js`, `desarrollo-web.js`), cada uno con su comando slash. `desarrollo-web` invoca a `qa-codigo-limpio` como sub-workflow en su fase de verificación (un solo nivel de anidamiento). Reparto de modelos por tipo de trabajo, bucle de fallo acotado, y ningún camino hace `git push` de forma autónoma.

**Tech Stack:** Claude Code Workflow tool (scripts JS planos, sin TypeScript ni acceso a Node/filesystem dentro del script — todo I/O real lo hacen los `agent()`), subagentes `frontend-developer`/`backend-architect` (composio-community, ya instalados), skills de QA ya instaladas en el repo (`webapp-testing`, `playwright-dev`, `accessibility-compliance`), herramientas MCP del vault de Obsidian.

**Spec:** `docs/superpowers/specs/2026-08-31-desarrollo-web-qa-workflow-design.md`

## Global Constraints

- Ningún camino del workflow ejecuta `git push` de forma autónoma — solo `git commit` local. El push a `main` (auto-despliega en Vercel) lo confirma Krisix aparte.
- Bucle de fallo: máximo **2 rondas** de reintento (re-briefing). Si tras 2 rondas QA sigue en `fail`, el workflow para sin commitear y devuelve un informe de bloqueo — nunca decide solo, nunca reintenta indefinidamente.
- Modelos: **Opus** (`claude-opus-5`) para pasos de orquestador/decisión (plan, veredicto de QA, entrega final); **Sonnet** (`claude-sonnet-5`) para trabajo de código (frontend-developer, backend-architect, revisión visual/accesibilidad); **Haiku** (`claude-haiku-4-5-20251001`) para pasos mecánicos (build/lint).
- Los workflows y comandos viven en `E:\agencia-web\portfolio\.claude\` (`workflows/`, `commands/`) — este repo de código, nunca en el repo del vault.
- `desarrollo-web` invoca `qa-codigo-limpio` vía `workflow('qa-codigo-limpio', {...})` — QA sigue siendo un departamento independiente e invocable por sí solo (`/qa-codigo-limpio`), no un atajo interno.
- No gating de `prefers-reduced-motion` sobre los efectos decorativos (cursor, marquee, contadores, scroll) — decisión de producto ya tomada, QA no debe señalarlo como bug.

---

### Task 1: Workflow `qa-codigo-limpio.js`

**Files:**
- Create: `.claude/workflows/qa-codigo-limpio.js`

**Interfaces:**
- Consumes: nada (workflow raíz). Args opcionales: `{ alcance?: string }` — descripción en texto de qué archivos/secciones revisar; si se omite, revisa todo el working tree.
- Produces: workflow guardado con nombre `'qa-codigo-limpio'`, invocable vía `Workflow({name: 'qa-codigo-limpio', args})` o `workflow('qa-codigo-limpio', args)` desde otro script. Devuelve `{ status: 'pass'|'fail', issues: [{severity, description, file}] }`.

- [ ] **Step 1: Escribir el script completo**

```js
export const meta = {
  name: 'qa-codigo-limpio',
  description: 'Verifica build, lint, visual/funcional y accesibilidad del sitio Anclora, y sintetiza un veredicto',
  phases: [
    { title: 'Build y Lint' },
    { title: 'Verificacion visual y accesibilidad' },
    { title: 'Veredicto' },
  ],
}

const BUILD_LINT_SCHEMA = {
  type: 'object',
  properties: {
    buildPassed: { type: 'boolean' },
    lintPassed: { type: 'boolean' },
    errors: { type: 'array', items: { type: 'string' } },
  },
  required: ['buildPassed', 'lintPassed', 'errors'],
}

const CHECK_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
          description: { type: 'string' },
        },
        required: ['severity', 'description'],
      },
    },
  },
  required: ['status', 'issues'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
          description: { type: 'string' },
          file: { type: 'string' },
        },
        required: ['severity', 'description', 'file'],
      },
    },
  },
  required: ['status', 'issues'],
}

const alcance = (args && args.alcance) || 'todo el working tree del repo (usa git status/git diff para verlo)'

phase('Build y Lint')
const buildLint = await agent(
  `Estás en el repo E:\\agencia-web\\portfolio (proyecto Next.js). Ejecuta EXACTAMENTE estos dos comandos con Bash, en este orden: "npm run build" y "npm run lint". No interpretes los resultados ni intentes arreglar nada - tu único trabajo es reportar la salida cruda. buildPassed=true solo si "npm run build" termina con código de salida 0. lintPassed=true solo si "npm run lint" termina con código de salida 0. errors: cada línea de error/warning relevante de ambos comandos (vacío si no hay ninguno).`,
  { schema: BUILD_LINT_SCHEMA, model: 'claude-haiku-4-5-20251001', phase: 'Build y Lint' }
)

phase('Verificacion visual y accesibilidad')
const [visual, a11y] = await parallel([
  () => agent(
    `Estás en el repo E:\\agencia-web\\portfolio. Revisa visual y funcionalmente: ${alcance}. Levanta el sitio si hace falta (npm run dev en background) y comprueba: (1) que renderiza sin errores de consola ni de hidratación, (2) que los efectos decorativos (cursor personalizado, marquee, contadores animados, scroll) están activos - NO deben estar apagados ni condicionados por prefers-reduced-motion, es una decisión de producto ya tomada, no un bug a señalar, (3) que el diseño no se ve genérico/plantilla (requisito explícito del dueño del proyecto). Usa las skills playwright-dev/webapp-testing ya instaladas en el repo si ayudan. status='fail' solo si encuentras un problema real, con severidad y descripción de cada uno.`,
    { schema: CHECK_SCHEMA, model: 'claude-sonnet-5', phase: 'Verificacion visual y accesibilidad', label: 'visual' }
  ),
  () => agent(
    `Estás en el repo E:\\agencia-web\\portfolio. Revisa accesibilidad de: ${alcance} - contraste de color, semántica HTML, navegación por teclado, atributos ARIA donde falten. Usa la skill accessibility-compliance ya instalada en el repo. IMPORTANTE: no propongas apagar los efectos decorativos (cursor, marquee, contadores, scroll) como solución a ningún hallazgo - es una decisión de producto ya tomada, busca alternativas que la respeten. status='fail' solo si encuentras un problema real, con severidad y descripción de cada uno.`,
    { schema: CHECK_SCHEMA, model: 'claude-sonnet-5', phase: 'Verificacion visual y accesibilidad', label: 'a11y' }
  ),
])

phase('Veredicto')
const veredicto = await agent(
  `Sintetiza estos tres resultados de QA en un solo veredicto. Build y lint: ${JSON.stringify(buildLint)}. Visual/funcional: ${JSON.stringify(visual)}. Accesibilidad: ${JSON.stringify(a11y)}. Si algún resultado es null (fallo técnico al ejecutar ese chequeo), trátalo como status='fail' con un issue describiendo que no se pudo verificar. status='fail' del veredicto final si buildPassed=false, si lintPassed=false, o si hay algún issue de severidad 'high' en visual o accesibilidad; en caso contrario 'pass'. Combina TODOS los issues (errores de build/lint incluidos) en una sola lista, indicando en 'file' el archivo afectado cuando se pueda inferir (usa 'desconocido' si no se puede).`,
  { schema: VERDICT_SCHEMA, model: 'claude-opus-5', phase: 'Veredicto' }
)

return veredicto
```

- [ ] **Step 2: Revisión estática del archivo**

Releer el archivo escrito y confirmar: sin anotaciones de TypeScript, `meta` es un literal puro (sin variables/spreads), los 3 schemas son JSON Schema válido, `phase()` usa exactamente los mismos 3 títulos que `meta.phases`, no hay `Date.now()`/`Math.random()`/`new Date()` en ningún punto.

- [ ] **Step 3: Commit**

```bash
cd "E:\agencia-web\portfolio"
git add .claude/workflows/qa-codigo-limpio.js
git commit -m "Add qa-codigo-limpio workflow: build/lint, visual, a11y, veredicto"
```

---

### Task 2: Comando `/qa-codigo-limpio`

**Files:**
- Create: `.claude/commands/qa-codigo-limpio.md`

**Interfaces:**
- Consumes: workflow guardado `'qa-codigo-limpio'` (Task 1).
- Produces: comando slash `/qa-codigo-limpio` invocable desde una sesión de Claude Code dentro del repo.

- [ ] **Step 1: Escribir el comando**

```markdown
---
description: Lanza el departamento QA/Código Limpio (build, lint, visual, accesibilidad) sobre el estado actual del repo
---

Invoca la herramienta Workflow con `name: "qa-codigo-limpio"` (sin `args` - revisa todo el working tree actual del repo `E:\agencia-web\portfolio`). Cuando el resultado llegue, resume el veredicto (`pass`/`fail`) y lista cada incidencia con su severidad y archivo, en español.
```

- [ ] **Step 2: Commit**

```bash
cd "E:\agencia-web\portfolio"
git add .claude/commands/qa-codigo-limpio.md
git commit -m "Add /qa-codigo-limpio slash command"
```

---

### Task 3: Validar `qa-codigo-limpio` con una ejecución real

**Files:** ninguno (solo ejecución/validación)

**Interfaces:**
- Consumes: comando `/qa-codigo-limpio` (Task 2).
- Produces: confirmación de que el workflow completo (Build y Lint → Verificación → Veredicto) se ejecuta y devuelve un veredicto con forma válida (`status` + `issues[]`).

- [ ] **Step 1: Ejecutar el comando**

Desde una sesión de Claude Code con working directory en `E:\agencia-web\portfolio`, invocar `/qa-codigo-limpio`. Esto revisa de paso el estado real de las 6 secciones ya escritas sin commitear - resultado útil en sí mismo, no solo una prueba.

- [ ] **Step 2: Verificar la forma del resultado**

Confirmar en la notificación de la tarea: el veredicto trae `status` (`'pass'` o `'fail'`) y `issues` es un array (vacío o con entradas `{severity, description, file}`). Si el workflow lanzó un error de ejecución (no un veredicto `fail` legítimo - eso es un resultado válido), diagnosticar con `systematic-debugging` antes de continuar: leer `journal.jsonl` del run para ver qué agente falló y por qué.

- [ ] **Step 3: Dejar constancia**

No hace falta commit en este paso (no se tocó código) - si el veredicto es `fail`, anotar las incidencias para que las recoja el Task 6 cuando se ejecute `/desarrollo-web` sobre las mismas secciones.

---

### Task 4: Workflow `desarrollo-web.js`

**Files:**
- Create: `.claude/workflows/desarrollo-web.js`

**Interfaces:**
- Consumes: workflow guardado `'qa-codigo-limpio'` (Task 1, invocado vía `workflow()`), agentTypes `'frontend-developer'` y `'backend-architect'` (ya instalados globalmente).
- Produces: workflow guardado con nombre `'desarrollo-web'`. Args requeridos: `{ tarea: string }`. Devuelve `{ status: 'entregado', plan, veredicto, entrega }` o `{ status: 'bloqueado', plan, veredicto, mensaje }`.

- [ ] **Step 1: Escribir el script completo**

```js
export const meta = {
  name: 'desarrollo-web',
  description: 'Departamento Desarrollo Web/3D: planifica, reparte a frontend/backend, verifica con QA y deja el commit listo (sin push)',
  phases: [
    { title: 'Intake y Plan' },
    { title: 'Desarrollo' },
    { title: 'QA' },
    { title: 'Entrega' },
  ],
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    interpretacion: { type: 'string' },
    trabajadores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rol: { type: 'string', enum: ['frontend', 'backend'] },
          encargo: { type: 'string' },
          archivos: { type: 'array', items: { type: 'string' } },
          criterioAceptacion: { type: 'string' },
        },
        required: ['rol', 'encargo', 'archivos', 'criterioAceptacion'],
      },
    },
    queDebeRevisarQA: { type: 'string' },
  },
  required: ['interpretacion', 'trabajadores', 'queDebeRevisarQA'],
}

const tarea = args && args.tarea
if (!tarea) {
  throw new Error('desarrollo-web requiere args.tarea con la descripción del encargo')
}

phase('Intake y Plan')
const plan = await agent(
  `Eres el orquestador del departamento Desarrollo Web/3D de la agencia Anclora. Estás en el repo E:\\agencia-web\\portfolio (Next.js + React Three Fiber). Encargo recibido: "${tarea}". Antes de planificar: ejecuta "git status" y "git diff" con Bash para ver el estado REAL del árbol de trabajo, no asumas nada de memoria. Descompón el encargo en encargos autocontenidos por trabajador (rol frontend y/o backend - omite backend si el encargo no necesita API/base de datos, que es el caso normal en este sitio de marketing estático). Cada encargo lleva el contexto completo (no un resumen) y un criterio de aceptación concreto y verificable. Si el encargo es ambiguo en algún punto, NO lo resuelvas en silencio: elige la interpretación más razonable y decláralo explícitamente en 'interpretacion' para que se pueda corregir al revisar. Indica también en 'queDebeRevisarQA' qué debe revisar QA específicamente.`,
  { schema: PLAN_SCHEMA, model: 'claude-opus-5', phase: 'Intake y Plan' }
)

function ejecutarTrabajador(w, motivo) {
  const agentType = w.rol === 'backend' ? 'backend-architect' : 'frontend-developer'
  const prompt = motivo
    ? `Eres el trabajador ${w.rol} del departamento Desarrollo Web/3D. QA rechazó tu trabajo anterior. Incidencias concretas: ${motivo}. Tu encargo original: ${w.encargo} sobre los archivos: ${w.archivos.join(', ')}. Corrige SOLO lo que las incidencias señalan que afecte a tus archivos asignados, sin tocar nada más de lo necesario.`
    : `Eres el trabajador ${w.rol} del departamento Desarrollo Web/3D. Tu encargo: ${w.encargo}. Archivos a tocar: ${w.archivos.join(', ')}. Criterio de aceptación: ${w.criterioAceptacion}. Si encuentras una duda de diseño/criterio o un error que no sabes resolver, NO decidas en silencio ni sigas adivinando - repórtalo claramente en tu respuesta final para que el orquestador lo resuelva. Cuando termines, describe brevemente qué cambiaste y por qué.`
  return agent(prompt, { agentType, model: 'claude-sonnet-5', phase: 'Desarrollo', label: w.rol })
}

phase('Desarrollo')
if (plan.trabajadores.length) {
  await parallel(plan.trabajadores.map((w) => () => ejecutarTrabajador(w)))
}

const archivosTocados = plan.trabajadores.flatMap((w) => w.archivos)
const alcanceQA = archivosTocados.length
  ? `${archivosTocados.join(', ')} - QA debe prestar atención especial a: ${plan.queDebeRevisarQA}`
  : `todo el working tree - QA debe prestar atención especial a: ${plan.queDebeRevisarQA}`

phase('QA')
let veredicto = await workflow('qa-codigo-limpio', { alcance: alcanceQA })

let rondas = 0
while (veredicto && veredicto.status === 'fail' && rondas < 2) {
  rondas += 1
  log(`QA rechazó (ronda ${rondas}/2) - reenviando a los trabajadores con las incidencias concretas`)
  const incidencias = JSON.stringify(veredicto.issues)
  if (plan.trabajadores.length) {
    await parallel(plan.trabajadores.map((w) => () => ejecutarTrabajador(w, incidencias)))
  }
  veredicto = await workflow('qa-codigo-limpio', { alcance: alcanceQA })
}

phase('Entrega')
if (!veredicto || veredicto.status === 'fail') {
  return {
    status: 'bloqueado',
    plan,
    veredicto,
    mensaje: `QA no aprobó tras ${rondas} ronda(s) de reintento. No se ha hecho commit. Revisa las incidencias y decide cómo seguir.`,
  }
}

const entrega = await agent(
  `Eres el orquestador del departamento Desarrollo Web/3D, en la fase de entrega final. QA aprobó el trabajo. Encargo original: "${tarea}". Plan ejecutado: ${JSON.stringify(plan)}. En el repo E:\\agencia-web\\portfolio: (1) ejecuta "git add -A" y "git commit" con un mensaje descriptivo del encargo (usa Bash) - NUNCA ejecutes "git push" bajo ninguna circunstancia, eso lo confirma Krisix aparte. (2) Escribe el informe de esta sesión de desarrollo en el vault de Obsidian (E:/emprendimiento) usando las herramientas MCP disponibles: una entrada nueva en 'Dev Logs/' con formato 'YYYY-MM-DD - Descripción.md', una mención en 'Projects/Agencia de Mantenimiento Web con IA.md', y una mención en la nota diaria de hoy - sigue el formato que ya usan las entradas existentes de esas carpetas. Devuelve un resumen de qué commiteaste (hash) y dónde quedó escrito el informe.`,
  { model: 'claude-opus-5', phase: 'Entrega' }
)

return { status: 'entregado', plan, veredicto, entrega }
```

- [ ] **Step 2: Revisión estática del archivo**

Confirmar: sin anotaciones TS, `meta` es literal puro, `PLAN_SCHEMA` es JSON Schema válido, los títulos pasados a `phase()` coinciden exactamente con `meta.phases`, no hay `Date.now()`/`Math.random()`/`new Date()`, el `throw` sin `args.tarea` está antes de cualquier `agent()` (falla rápido y barato).

- [ ] **Step 3: Commit**

```bash
cd "E:\agencia-web\portfolio"
git add .claude/workflows/desarrollo-web.js
git commit -m "Add desarrollo-web workflow: plan, dispatch, QA loop, entrega sin push"
```

---

### Task 5: Comando `/desarrollo-web`

**Files:**
- Create: `.claude/commands/desarrollo-web.md`

**Interfaces:**
- Consumes: workflow guardado `'desarrollo-web'` (Task 4).
- Produces: comando slash `/desarrollo-web "<encargo>"`.

- [ ] **Step 1: Escribir el comando**

```markdown
---
description: Lanza el departamento Desarrollo Web/3D sobre un encargo concreto (planifica, reparte, verifica con QA, deja el commit listo sin push)
argument-hint: "<descripción del encargo>"
---

Invoca la herramienta Workflow con `name: "desarrollo-web"` y `args: {"tarea": "$ARGUMENTS"}`. No hagas nada más en este turno aparte de esa llamada. Cuando el resultado llegue: si `status` es `'entregado'`, resume en español qué se hizo y qué commit quedó listo para que Krisix confirme el push; si es `'bloqueado'`, resume el motivo del bloqueo y qué decisión hace falta - nunca hagas `git push` tú mismo sin que Krisix lo confirme explícitamente.
```

- [ ] **Step 2: Commit**

```bash
cd "E:\agencia-web\portfolio"
git add .claude/commands/desarrollo-web.md
git commit -m "Add /desarrollo-web slash command"
```

---

### Task 6: Entregar el primer encargo real a través del workflow

**Files:** los que toque el propio workflow dentro de `src/` (decisión de los agentes `frontend-developer`/`backend-architect`, no del plan) — este task es la validación end-to-end del sistema completo, no una tarea de código de plan cerrado.

**Interfaces:**
- Consumes: `/desarrollo-web` (Task 5), que a su vez usa `qa-codigo-limpio` (Tasks 1-3).
- Produces: commit local (sin push) con las 6 secciones de Anclora pulidas y verificadas, más el informe en el vault.

- [ ] **Step 1: Ejecutar el comando con el encargo real**

Desde una sesión de Claude Code con working directory en `E:\agencia-web\portfolio`:

```
/desarrollo-web "Revisa, pule y verifica las secciones de la home ya escritas en local pero sin commitear (Marquee, Stats, Services, Process, Contact, Footer, cursor personalizado, magnetic-button) y los cambios pendientes en Hero, Nav, layout y globals.css. El objetivo es dejarlas listas para producción: sin errores de build/lint, con los efectos decorativos (cursor, marquee, contadores, scroll) activos y sin gating por prefers-reduced-motion, con buena accesibilidad, y sin que el diseño se vea genérico o de plantilla."
```

- [ ] **Step 2: Verificar el resultado**

Comprobar en la notificación de la tarea: `status` es `'entregado'` (commit local hecho, sin push) o `'bloqueado'` (informe claro de qué falló). En cualquiera de los dos casos, confirmar con `git log`/`git status` en el repo que efectivamente NO se hizo push a `origin/main`.

```bash
cd "E:\agencia-web\portfolio"
git log --oneline -5
git status
```

- [ ] **Step 3: Confirmar el informe en el vault**

Verificar que existe la nueva entrada en `Dev Logs/`, y que `Projects/Agencia de Mantenimiento Web con IA.md` y la nota diaria de hoy tienen la mención correspondiente, como describe la fase de Entrega del workflow.

- [ ] **Step 4: Decisión de push (manual, fuera del workflow)**

Si `status` fue `'entregado'` y Krisix aprueba el resultado tras revisarlo, hacer el push manualmente (fuera de este plan, es una acción separada y confirmada):

```bash
cd "E:\agencia-web\portfolio"
git push origin main
```

---

## Self-Review

- **Cobertura de la spec:** Task 1-3 cubren `qa-codigo-limpio.js` + comando + validación real. Task 4-5 cubren `desarrollo-web.js` + comando (plan, dispatch, QA anidado, bucle de fallo de 2 rondas, entrega sin push, informe al vault). Task 6 cubre el primer caso de uso real de la spec. El reparto de modelos Opus/Sonnet/Haiku está en cada `agent()` de ambos scripts. La restricción de no-push está en el prompt de Entrega y se verifica explícitamente en Task 6 Step 2.
- **Placeholders:** ninguno - todos los pasos tienen código real, no descripciones.
- **Consistencia de tipos:** `veredicto` siempre trae `{status, issues[]}` desde `qa-codigo-limpio.js`, y `desarrollo-web.js` lo consume con esa misma forma en el bucle de fallo y en el resultado final. `plan.trabajadores[].{rol, encargo, archivos, criterioAceptacion}` se usa igual en `ejecutarTrabajador` tanto en el despacho inicial como en los reintentos.
