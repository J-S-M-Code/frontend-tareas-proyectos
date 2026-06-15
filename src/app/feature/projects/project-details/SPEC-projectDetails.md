# SPEC: Detalles del Proyecto (Project Details)

## Nombre de la feature
Project Details (Visualización de la información de un proyecto y sus tareas asociadas).

## Descripción general
Implementar una vista que, al acceder al ID de un proyecto, despliegue su información básica y la lista completa de las tareas correspondientes a ese proyecto. Permitirá navegar a los detalles de cada tarea individual y crear nuevas tareas pre-asignadas a este proyecto.

## Endpoints involucrados
- **GET** `/projects` (utilizado para buscar el proyecto por ID localmente, ya que no existe un endpoint `GET /projects/{id}`).
- **GET** `/projects/{idProject}/tasks`
- **Response:**
  - `200 OK` con la lista de tareas (`TaskResponseDTO[]`).

## Restricciones de negocio
1. Si el usuario ingresa a un proyecto que no existe o fue eliminado, se debe mostrar un mensaje "El proyecto no existe".
2. Debe mostrar todas las tareas asociadas con indicadores de estado ("TODO", "IN_PROGRESS", "DONE").
3. Al hacer clic en "Nueva Tarea", debe redirigir al formulario de creación llevando el ID del proyecto en la URL como Query Parameter.

## Lineamientos técnicos
- **Ruteo:** Captura dinámica de `:id` vía `ActivatedRoute`.
- **UI:** Tailwind CSS para Layout. PrimeNG (Tags, ProgressSpinner, Message, Button).
- **Gestión de Estado:** Uso de Signals para proyectos y tareas.

## Criterios de aceptación
- **Dado** que se ingresa a `/projects/:id` de un proyecto existente
- **Cuando** la data carga
- **Entonces** se ven las métricas del proyecto y el listado de tareas.
- **Dado** que se ingresa a `/projects/:id` de un proyecto inexistente
- **Cuando** la API retorna error o no lo encuentra en la lista local
- **Entonces** se muestra un mensaje de error y permite volver al inicio.
- **Dado** que el proyecto no tiene tareas asociadas
- **Cuando** la data de tareas carga
- **Entonces** se muestra un estado vacío indicando que "Aún no se han creado tareas para este proyecto".
