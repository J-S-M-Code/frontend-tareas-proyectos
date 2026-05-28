## Iteración 1: Generación del andamiaje inicial (Scaffolding)
**Propósito:** Proveer el contexto completo (SPEC) para generar la primera versión del componente, la vista y la conexión con el servicio.

**Prompt utilizado:**
> "A continuación te comparto la SPEC para la funcionalidad 'Listado de Tareas por Estado'. 
```
# SPEC: Listado de Tareas por Estado

## Nombre de la feature
Get Tasks by Status (Obtener tareas por estado).

## Descripción general
Implementar una vista que permita al usuario seleccionar un estado específico (por ejemplo: `TODO`, `IN_PROGRESS`, `DONE`) a través de un control de UI y visualizar un tablero de tarjetas (Cards) con todas las tareas que se encuentran actualmente en dicho estado. 

## Endpoints involucrados
- **GET** `/tasks/{status}`
- **Request Parameters:**
  - `status` (Path Variable): El estado por el cual se desean filtrar las tareas (ej. `TODO`).
- **Response:**
  - `200 OK` con un array de objetos Tarea (`Task[]`).
- **Errores:**
  - `400 Bad Request` (Si el estado enviado no es válido o no es reconocido por el sistema).
  - `500 Internal Server Error` (Error no controlado en el código del servidor).

## Restricciones de negocio
1. Los estados disponibles para seleccionar en la interfaz deben coincidir estrictamente con los definidos en el dominio (por defecto: `TODO`, `IN_PROGRESS`, `DONE`).
2. La búsqueda y filtrado se delega al backend; el frontend no debe traer todas las tareas y filtrarlas en memoria.
3. Si el estado seleccionado no contiene ninguna tarea, la interfaz no debe mostrar un contenedor vacío genérico, sino un mensaje amigable o empty state visual indicando explícitamente que "No se encontraron tareas con el estado seleccionado".
4. El estado seleccionado por defecto al ingresar a la vista debe ser `TODO`.

## Lineamientos técnicos
- **Arquitectura:** Uso estricto de componentes **Standalone**.
- **Estilos y UI:** Uso intensivo de **Tailwind CSS** para maquetado y utilidades. Para el selector de estados se utilizará un `<select>` nativo de HTML5. Las tareas se renderizarán utilizando un diseño de cuadrícula (Grid) de Tarjetas (Cards) completamente creadas con Tailwind. Los componentes de **PrimeNG** se limitarán exclusivamente al feedback visual e interacción secundaria (`ProgressSpinner`, `Button`).
- **Gestión de Estado:** Uso de **Signals** para manejar la reactividad de la vista de forma moderna:
  - `selectedStatus()` para el estado actual elegido.
  - `tasks()` para almacenar la lista de resultados.
  - `isLoading()` para el esqueleto de carga o spinners.
  - `errorMessage()` para gestionar el feedback de errores.
- **Servicios:** Extender el `TaskService` existente, inyectando `HttpClient` para realizar la petición GET correspondiente. Se debe utilizar la interfaz `Task` que contenga todos los atributos necesarios para la vista (id, title, estimatedHours, assignee, status).

## Criterios de aceptación

### Escenario 1: Filtrado exitoso de tareas
- **Dado** que el usuario se encuentra en la vista de filtrado de tareas por estado
- **Cuando** selecciona un estado válido (por ejemplo, "IN_PROGRESS") en el selector
- **Entonces** el sistema muestra un indicador visual de carga temporal, realiza la petición GET al backend, y al recibir la respuesta, actualiza la pantalla mostrando el tablero de tarjetas con únicamente las tareas correspondientes a ese estado.

### Escenario 2: Estado sin tareas asociadas
- **Dado** que el usuario selecciona un estado específico en el filtro
- **Cuando** el backend responde exitosamente pero con una lista vacía de tareas
- **Entonces** se debe ocultar el listado de tarjetas de resultados y mostrar un mensaje o ilustración amigable (Empty State) indicando que no hay tareas.

### Escenario 3: Manejo de errores de conexión o servidor
- **Dado** que el usuario intenta filtrar por un estado
- **Cuando** ocurre un error de red o el servidor responde con un error (ej. `500 Internal Server Error`)
- **Entonces** el indicador de carga se detiene y la vista muestra un mensaje de error claro al usuario, ofreciendo un botón para "Intentar de nuevo" la operación.

### Escenario 4: Estado inicial de la vista
- **Dado** que el usuario ingresa por primera vez a la ruta de la vista
- **Cuando** la página termina de renderizarse
- **Entonces** el selector de estado debe tener una opción por defecto seleccionada (ej. `TODO`) y la vista debe mostrar automáticamente los resultados correspondientes a ese estado inicial sin requerir un clic extra del usuario.

## Prompts utilizados
Revisar archivo `Prompts-getTasksByStatus.md`
```
> Ahora con este SPEC vamos a empezar con el desarrollo, vamos a colocar por el momento un boton en la pestaña principal para acceder, luego modificaremos y colocaremos un menu mas interactivo y mas bonito, por el momento implementemos los filtro y el listado que mostrara las tareas."

---

## Iteración 2: Refinamiento técnico y de UI (Pivot de diseño)
**Propósito:** Adaptar la solución generada a problemas de dependencias y mejorar drásticamente la experiencia de usuario (UX) cambiando la tabla por tarjetas (Cards).

**Prompts utilizados:**
> 1. "Cannot find module 'primeng/dropdown' or its corresponding type declarations. No funciona esto, intenta implementarlo con otra cosa que no sea dropdown."
> *(Resultado: Se reemplazó el componente complejo de PrimeNG por un `<select>` nativo de HTML5 estilizado con Tailwind CSS).*

> 2. "Está feísima la tabla, cambiemos por algo más lindo, tampoco es hacer una chambonada."
> *(Resultado: Se eliminó el uso de `<p-table>` y se construyó un Grid de Tailwind CSS con un diseño de tarjetas modernas para renderizar cada tarea, mejorando la legibilidad).*

> 3. "Quiero cambiar el color de las tarjetas, ¿cómo lo hacemos?"
> *(Resultado: Se implementaron clases dinámicas de Tailwind (`[ngClass]`) para cambiar los estilos y colores dependiendo de si la tarea está en estado TODO, IN_PROGRESS o DONE).*

---

## Conclusión de la sesión
El código fue evolucionando desde una implementación estándar con PrimeNG puro hacia una solución híbrida mucho más limpia, priorizando Tailwind CSS para el layout y tarjetas, y reservando PrimeNG estrictamente para el feedback visual (Spinners y Mensajes de error).