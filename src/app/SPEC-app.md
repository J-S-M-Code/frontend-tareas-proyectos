# SPEC: App Component (Layout y Navegación Global)

## Nombre de la feature
Global Layout & Navbar (Estructura base y componente raíz de la aplicación).

## Descripción general
Proveer el componente raíz (`app.component.html`) que contiene el menú de navegación principal superior (Navbar) para enrutar internamente a las distintas vistas de la aplicación. Actúa como el contenedor principal utilizando `<router-outlet>`.

## Restricciones de negocio
1. El navbar debe estar fijo y visible globalmente en todas las rutas de la aplicación, incluyendo escenarios donde la ruta dinámica no fue encontrada o se muestran errores 404, garantizando una vía de escape hacia el inicio.
2. Los enlaces de navegación (ej. "Inicio", "Tablero") deben indicar su estado activo resaltándose visualmente cuando el usuario se encuentre en la ruta correspondiente para dar contexto de ubicación.

## Lineamientos técnicos
- **Estilos y UI:** Tailwind CSS para generar un Navbar moderno y responsivo. Se utilizan directivas de Angular (`routerLinkActive`) para aplicar las clases de estado activo.
- **Marca:** Título de la aplicación establecido como "Tareas-Proyectos" con un ícono de capas representativo.

## Criterios de aceptación

### Escenario 1: Persistencia y navegación base
- **Dado** que el usuario ingresa a cualquier vista de la aplicación
- **Cuando** navega entre las diferentes secciones haciendo clic en los enlaces del menú
- **Entonces** el Navbar principal permanece visible en la parte superior y la navegación se realiza de manera fluida (SPA) sin recargar la página.

### Escenario 2: Resaltado de ruta activa
- **Dado** que el usuario utiliza el sistema
- **Cuando** la URL actual coincide con la ruta asignada a un ítem de navegación (ej. `/`)
- **Entonces** el componente añade dinámicamente las clases CSS de resaltado activo a ese ítem en específico.
