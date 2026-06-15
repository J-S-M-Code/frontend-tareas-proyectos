## Primer mensaje

### Contexto del sistema:
Estoy desarrollando un fronted de una app de gestion de tareas y proyectos.  
El backend es una API REST (Java) con autenticación JWT en el header Authorization.  
El front lo realizamos con Angular con standalone components, Reactive Forms, Tailwind CSS + PrimeNG.  
Feature a implementar, agregar comentarios a una tarea.
```
Descripción: Implementar un componente y formulario que permita al usuario registrar comentarios u observaciones de texto en una tarea específica asociada a un proyecto. El comentario requiere el texto y el autor del mismo.
Endpoint: POST /projects/{projectId}/tasks/{taskId}/comments.
Request Body: { "text": "string", "author": "string" }.
Response: 201 Created con el objeto creado.
Errores: 400 Bad Request, 404 Not Found (si no existe el proyecto o la tarea).
Restricciones: 
1. El comentario debe estar asociado obligatoriamente a una Tarea válida.
2. El campo `text` es de carácter obligatorio y no puede estar nulo ni vacío.
3. El campo `author` es de carácter obligatorio para identificar quién realiza el aporte y no puede estar vacío.
Lineamientos técnicos:
Componentes Standalone.
Reactive Forms para manejar la entrada de datos y sus validaciones en el frontend.
Uso de Tailwind CSS + Prime
Signals para manejar el estado de la vista.
Extensión del servicio TaskService usando HttpClient.
Criterios de aceptación:
- Dado que el usuario ingresó un texto y un autor válidos, Cuando hace clic en el botón de comentar, Entonces se muestra un indicador de carga, se envía la petición, se limpia el formulario y se muestra un mensaje de éxito.
- Dado que el formulario tiene el campo de texto o autor vacíos, Cuando el usuario intenta enviar el formulario, Entonces el botón de envío permanece deshabilitado o se muestran mensajes de error indicando los campos obligatorios.
- Dado que ocurre un error de conexión o un error en el servidor, Cuando se intenta enviar el comentario, Entonces el sistema captura el error, oculta el indicador de carga y muestra una alerta visual permitiendo al usuario reintentar.
```
### Restricciones técnicas:
- El servicio debe llamarse commentTaskService y vivir en src/app/services/
- El componente debe ser standalone con ChangeDetectionStrategy.OnPush
- Manejar estados de carga, error y lista vacía en el template 
### Formato de salida: 
Aquí necesitamos los ts y los html (como usamos tw y NG aca va también la estética)