## Primer mensaje
### Contexto del sistema:
Estoy desarrollando un fronted de una app de gestion de tareas y proyectos.  
El backend es una API REST (Java) con autenticación JWT en el header Authorization.  
El front lo realizamos con Angular con standalone components, Reactive Forms, Tailwind CSS + PrimeNG.  
Feature a implementar, Crear un nuevo proyecto
```
Descripcion: El usuario autenticado puede crear un nuevo proyecto. Para crear un proyecto debe ingresar el nombre, la fecha de inicio, la fecha de fin, seleccionar un estatus e ingresar una descpripcion.
Endpoint: POST /projects
	- Response: entidad de proyecto con id, nombre, fecha de inicio, fecha de fin, status y descripcion.
	- 409 si ya existe un proyecto con el mismo nombre o si se violo alguina regla de negocio.
Restricciones de negocio
	- Solo pueden crear proyectos usuario con token
	- El nombre del proyecto es obligatorio y debe ser único.
	- La fecha de fin (endDate) debe ser mayor o igual a la fecha actual (hoy) y es obligatoria.
	- La fecha de fin (endDate) debe ser mayor o igual a la fecha de inicio (startDate).
	- La fecha de inicio (startDate) debe ser menor a la fecha de fin(andDate) y es obligatoria.
	- El estado es obligatorio y debe ser uno de los permitidos (PLANNED, ACTIVE, CLOSED).
Lineamientos teoricos
	- HttpClient con interceptor JWT.
	- Componentes Standalone.
	- Reactive Forms para manejar las validaciones asíncronas y síncronas en el frontend.
	- Uso de Tailwind CSS + PrimeNG.
	- Signals para manejar el estado de la vista.
Criterios de aceptacion:
 	-Dado que el usuario ingresa al formulario vacío, Cuando intenta enviarlo, Entonces se muestran mensajes de error indicando los campos obligatorios.
	- Dado que el usuario ingresa una fecha de fin menor a la de inicio o en el pasado, Cuando completa el campo, Entonces el formulario marca la fecha como inválida.
	- Dado que el usuario ingresa un nombre de proyecto que ya existe, Cuando envía el formulario, Entonces la aplicación intercepta el error 409 del backend y muestra un mensaje de "El nombre ya existe".
	- Dado que el usuario ingresa datos válidos, Cuando hace clic en guardar, Entonces se muestra un indicador de carga, se envía la petición, se muestra el codigo 200, un mensaje de éxito y se resetea el formulario.
```
### Restricciones técnicas:
- El servicio debe llamarse ProyectService y vivir en src/app/services/
- El componente debe ser standalone con ChangeDetectionStrategy.OnPush
- Manejar estados de carga, error y lista vacía en el template

## Segundo mensaje
Este mensaje lo envié porque existían problemas de configuración con Tailwind CSS + PrimeNG.  

Vamos con las configuraciones que necesito para que funcione correctamente.  
Además en create-croject.component.js está con error en la sección de:  
`// Modulos de PrimeNG`  
`import { InputTextModule } from 'primeng/inputtext';`  
`import { InputTextareaModule } from 'primeng/inputtextarea';`  
`import { CalendarModule } from 'primeng/calendar';`  
`import { DropdownModule } from 'primeng/dropdown';`  
`import { ButtonModule } from 'primeng/button';`  
`import { MessageModule } from 'primeng/message';`   
Los errores que da son:  
`TS2307: Cannot find module primeng/inputtextarea or its corresponding type declarations.`  
`TS2307: Cannot find module primeng/calendar or its corresponding type declarations.`  
`TS2307: Cannot find module primeng/dropdown or its corresponding type declarations.`  
En el html tenemos un error con algunas etiquetas de PrimeNG y Tailwind.  
Explícame las correciones a aplicar.

