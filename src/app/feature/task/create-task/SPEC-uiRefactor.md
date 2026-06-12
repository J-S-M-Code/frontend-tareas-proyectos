# SPEC: Refactorización UI y Bugfixes en Formularios (Create Task / Add Comment)

## Nombre de la feature
Mejora Estética, Parametrización y Corrección de Formularios de Creación.

## Descripción general
Adaptar los formularios de creación de tareas y comentarios para recibir parámetros por URL (Query Params) con el fin de autocompletar y bloquear las selecciones de proyectos/tareas cuando se navega desde los detalles. Además, arreglar el validador estricto que impedía crear elementos válidos.

## Lineamientos técnicos
- **Query Params:** Uso de `ActivatedRoute.queryParams` para extraer `projectId` y `taskId`.
- **Formularios Reactivos:** Uso de `patchValue()` y `disable()` dinámicamente si vienen preseleccionados.
- **Validación:** Corrección de la expresión regular a `/.*\S.*/` para permitir textos reales en lugar de un único carácter.

## Criterios de aceptación
- **Dado** que se hace clic en "Nueva Tarea" desde el Proyecto 1 (`/create-task?projectId=1`)
- **Entonces** el selector de proyectos aparece con el "Proyecto 1" preseleccionado y los demás inputs habilitados.
- **Dado** que se ingresan espacios y varias palabras en el título
- **Entonces** el formulario es válido y permite guardar la tarea.
