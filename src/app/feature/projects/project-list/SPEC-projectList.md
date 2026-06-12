# SPEC: Obtener Listado de Proyectos (Project List)

## Nombre de la feature
Project List (Visualización de los proyectos activos y planificados de la organización).

## Descripción general
Implementar una vista principal que sirva como punto de entrada de la aplicación, mostrando un grid con todos los proyectos disponibles, permitiendo al usuario identificar rápidamente el estado y acceder a los detalles de cada uno. Desde aquí también se accederá a la funcionalidad de crear un nuevo proyecto.

## Endpoints involucrados
- **GET** `/projects`
- **Response:**
  - `200 OK` con un arreglo de objetos `ProjectResponseDTO` que contiene el ID, nombre y estado.
- **Errores:**
  - `500 Internal Server Error` (Error no controlado en el servidor).

## Restricciones de negocio
1. La vista mostrará los proyectos ordenados según la respuesta del backend.
2. Cada tarjeta de proyecto debe mostrar un Tag con un color representativo de su estado (PLANNED, ACTIVE, CLOSED).
3. Debe incluir un botón para "Crear Nuevo Proyecto" de fácil acceso.

## Lineamientos técnicos
- **Arquitectura:** Uso estricto de componentes **Standalone**.
- **Estilos y UI:** Uso intensivo de **Tailwind CSS** para un diseño moderno (Grid layout responsivo). Componentes de **PrimeNG** para botones y Tags.
- **Gestión de Estado:** Uso de **Signals** (`projects()`, `isLoading()`, `errorMessage()`).
- **Servicios:** Consumo del método `getAllProjects()` en el `ProjectService`.

## Criterios de aceptación
- **Dado** que el usuario ingresa a la ruta raíz (`/`) o `/projects`
- **Cuando** el servidor responde correctamente
- **Entonces** se muestran las tarjetas de los proyectos con un botón "Ver Detalles" que dirige a `/projects/:id`.
