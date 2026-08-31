---
description: Lanza el departamento Desarrollo Web/3D sobre un encargo concreto (planifica, reparte, verifica con QA, deja el commit listo sin push)
argument-hint: "<descripción del encargo>"
---

Invoca la herramienta Workflow con `name: "desarrollo-web"` y `args: {"tarea": "$ARGUMENTS"}`. No hagas nada más en este turno aparte de esa llamada. Cuando el resultado llegue: si `status` es `'entregado'`, resume en español qué se hizo y qué commit quedó listo para que Krisix confirme el push; si es `'bloqueado'`, resume el motivo del bloqueo y qué decisión hace falta - nunca hagas `git push` tú mismo sin que Krisix lo confirme explícitamente.
