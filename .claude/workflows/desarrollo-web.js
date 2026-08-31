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
  const agentType = w.rol === 'backend' ? 'backend-architect:backend-architect' : 'frontend-developer:frontend-developer'
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
