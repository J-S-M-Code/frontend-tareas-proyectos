# SPEC: Layout y Navegación Global (App Component)

## Nombre de la feature
Global Layout & Navbar (Estructura base de la aplicación).

## Descripción general
Proveer un componente raíz (`app.component.html`) que contenga el menú de navegación principal superior (Navbar) visible en todas las pantallas, y un contenedor dinámico (`<router-outlet>`) para renderizar las distintas vistas de la aplicación.

## Lineamientos técnicos
- **Estilos y UI:** Tailwind CSS para generar un Navbar moderno y responsivo con enlaces activos.
- **Marca:** Título de la aplicación establecido como "Tareas-Proyectos" con un ícono de capas representativo.

## Criterios de aceptación
- **Dado** que el usuario ingresa a cualquier vista de la aplicación
- **Entonces** el Navbar principal permanece fijo o visible en la parte superior, permitiendo la navegación fluida a "Inicio", "Proyectos" y "Tareas".
