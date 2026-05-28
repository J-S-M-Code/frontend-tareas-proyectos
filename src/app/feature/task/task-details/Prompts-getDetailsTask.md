## Iteración 1: Generación del andamiaje inicial (Scaffolding)
**Propósito:** Proveer el contexto completo (SPEC) para generar la primera versión del componente, la vista y la conexión con el servicio.  
**Prompt utilizado:**
> A continuación te comparto la SPEC para la funcionalidad 'Detalles de tarea'. 
```
# SPEC: Obtener Detalles de la Tarea (Get Deatils Task)

## Nombre de la feature
Get Task Details (Visualización de los detalles de una tarea y sus comentarios).

## Descripción general
Implementar una vista que permita al usuario consultar la información detallada de una tarea específica dentro de un proyecto. Esto incluye visualizar sus metadatos (título, descripción, estado, fechas) y un listado cronológico de todos los comentarios asociados a la misma.

## Endpoints involucrados
- **GET** `/projects/{projectId}/tasks/{taskId}`
- **Request Parameters:**
  - `projectId` (Path Variable): El identificador único del proyecto.
  - `taskId` (Path Variable): El identificador único de la tarea.
- **Response:**
  - `200 OK` con un objeto `TaskWithCommentsResponseDTO` que contiene los datos de la tarea y un arreglo de comentarios (`TaskComment[]`).
- **Errores:**
  - `400 Bad Request` (Si los IDs proporcionados no tienen un formato válido).
  - `404 Not Found` (Si el proyecto o la tarea no existen en la base de datos).
  - `500 Internal Server Error` (Error no controlado en el código del servidor).

## Restricciones de negocio
1. La vista es de carácter informativo (solo lectura). Para modificar el estado o agregar un comentario, se utilizarán flujos separados o componentes dedicados.
2. Si la tarea no posee comentarios, la interfaz no debe mostrar un contenedor vacío genérico ni arrojar error, sino presentar un mensaje amigable indicando explícitamente que "Aún no hay comentarios en esta tarea".
3. Los estados de la tarea mostrados en la interfaz (`TODO`, `IN_PROGRESS`, `DONE`) deben coincidir con los definidos en el dominio y representarse visualmente de forma clara.

## Lineamientos técnicos
- **Arquitectura:** Uso estricto de componentes **Standalone**.
- **Estilos y UI:** Uso intensivo de **Tailwind CSS** para el maquetado (Grid/Flexbox para organizar el título, metadatos y la lista de comentarios). Los componentes de **PrimeNG** se limitarán exclusivamente al feedback visual e interacción secundaria (ej. `ProgressSpinner` para la carga inicial, `Button` para un eventual botón de "Volver" o "Agregar Comentario", y `Tag` para el estado de la tarea).
- **Gestión de Estado:** Uso de **Signals** para manejar la reactividad de la vista de forma moderna y sin dependencias complejas:
  - `taskData()` para almacenar el objeto devuelto por el backend.
  - `isLoading()` para mostrar el spinner mientras se resuelve la petición.
  - `errorMessage()` para gestionar el feedback en caso de errores (ej. 404 o 500).
- **Servicios:** Extender el `TaskService` existente, inyectando `HttpClient` para realizar la petición GET correspondiente. Se debe mapear la respuesta estricta a una interfaz `TaskWithComments` en el frontend.
- **Ruteo:** El componente debe capturar dinámicamente los parámetros `projectId` y `taskId` desde la URL utilizando `ActivatedRoute`.

## Criterios de aceptación

### Escenario 1: Visualización exitosa de la tarea y sus comentarios
- **Dado** que el usuario navega a la ruta de detalles de una tarea válida
- **Cuando** el componente se inicializa y el backend responde exitosamente con los datos
- **Entonces** el sistema oculta el indicador de carga y renderiza la información de la tarea (título, descripción, estado) junto con la lista de comentarios ordenados, mostrando el texto y el autor de cada uno.

### Escenario 2: Tarea sin comentarios asociados
- **Dado** que el usuario ingresa a los detalles de una tarea válida
- **Cuando** el backend responde exitosamente pero el arreglo de comentarios está vacío
- **Entonces** la vista renderiza la información principal de la tarea y en la sección de comentarios muestra un mensaje o Empty State amigable indicando que no hay comentarios.

### Escenario 3: Manejo de errores (Tarea o Proyecto no encontrados)
- **Dado** que el usuario ingresa manualmente una URL con un `projectId` o `taskId` inexistente
- **Cuando** el backend responde con un error `404 Not Found`
- **Entonces** el indicador de carga se detiene y la vista muestra un mensaje claro indicando que "La tarea solicitada no existe o fue eliminada", ofreciendo un botón para volver al listado del proyecto.

### Escenario 4: Manejo de errores de conexión o servidor
- **Dado** que el usuario intenta visualizar los detalles de una tarea
- **Cuando** ocurre un error de red o el servidor responde con un error `500 Internal Server Error`
- **Entonces** el indicador de carga se detiene y la vista muestra un mensaje de error técnico amigable, ofreciendo un botón para "Intentar de nuevo".

## Prompts utilizados
Revisar archivo `Prompts-getDetailsTask.md`
```
> Ahora con este SPEC vamos a empezar con el desarrollo, vamos a colocar por el momento un boton en la pestaña principal para acceder, luego modificaremos y colocaremos un menu mas interactivo y mas bonito.  
> Ten en cuenta estas correciones para no cometer estos errores:
```
El template usa *ngIf y *ngFor (sintaxis clásica de Angular), mientras que la Spec define como lineamiento usar "Angular Standalone" y el agente generó las tarjetas usando *ngFor clásico. Esto no es un error funcional, pero el proyecto debería adoptar una convención consistente. Si el equipo ya usa @if/@for en otros componentes (como se ve en el PR de teslavmd), lo ideal es unificar. El agente puede generar ambas sintaxis — lo importante es indicarle en el prompt cuál usar.
```