## Iteración 1: Detalles del Proyecto y Tareas
**Propósito:** Crear la vista que agrupa la información del proyecto y muestra sus tareas.

**Prompt utilizado:**
> "cuando selecciones uno (proyecto), entraremos 'Detalles' que seran las tareas que tiene el proyecto, en la parte de arriba veremos los detalles y al igual que en el de proyectos, tendremos el boton para crear una nueva tarea. Cuando entremos dentro de una tarea veremos los detalles de la tarea con los comentarios que tiene..."

## Iteración 2: Ajuste de Endpoints (Falta de endpoint por ID)
**Propósito:** Ajustar la lógica del servicio ante la falta de un endpoint `GET /projects/{id}`.

**Prompt utilizado:**
> "Te paso los endpoint que tengo, ya que no tengo el end ya que no tengo para treaer el proyecto del id: @GetMapping("/projects"), @GetMapping("/projects/{idProject}/tasks")..."

> **Acción del Agente:** Se modificó `ProjectService.getProjectById` para consumir `getAllProjects()` y filtrar `.find()` localmente.

## Iteración 3: Filtrado local de Tareas y Corrección de UI
**Propósito:** Reutilizar la vista de filtrado por estados dentro del detalle del proyecto, solucionando bugs visuales del selector.

**Prompt utilizado:**
> "Luego mezcla la vista de tareas que entramos desde el nav, al que entramos a ver cuando seleccionamos el proyecto. O sea que pueda filtrar tambien las tareas que veo cuando seleeciono un propyecto..."
> "Pusiste la casilla de donde tengo que seleccionar el filtro en negro, y se ve mal, cambia eso"

> **Acción del Agente:** Se agregó un selector nativo de HTML con estilos de Tailwind en `ProjectDetailsComponent` para realizar un filtrado dinámico local de las tareas cargadas en el proyecto mediante `computed()` de Angular Signals, y se retiró el componente `p-select` para evitar problemas de contraste oscuro.
