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
