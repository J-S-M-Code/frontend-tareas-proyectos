## Primer mensaje

### Contexto del sistema:
Estoy desarrollando un fronted de una app de gestion de tareas y proyectos.  
El backend es una API REST (Java) con autenticación JWT en el header Authorization.  
El front lo realizamos con Angular con standalone components, Reactive Forms, Tailwind CSS + PrimeNG.  
Feature a implementar, crear tareas para un proyecto
```
Descripcion: Implementar una vista y un formulario que permita al usuario crear una nueva tarea (Task) y asociarla a un proyecto existente. La tarea requerirá un título, una estimación de horas, un responsable y el proyecto al cual se esta por asignar.
Endpoint:  POST /projects/{projectId}/tasks .
Request Body: { title: string, estimatedHours: number, assignee: string } .
Response: 201 Created con el objeto creado.
Errores: 400 Bad Request, 409 Conflict (nombre duplicado o regla de negocio).
Restricciones:
1. No se pueden agregar tareas a un proyecto que tenga el estado CLOSED
2. El campo estimatedHours debe ser estrictamente mayor a 0.
3. Los campos title y assignee son de carácter obligatorio.
4.El estado inicial de la tarea generada por el sistema será siempre TODO
Lineamientos técnicos:
Componentes Standalone.
Reactive Forms para manejar las validaciones asíncronas y síncronas en el frontend.
Uso de Tailwind CSS + PrimeNG (ej. componentes InputText, Calendar, Dropdown).
Signals para manejar el estado de la vista (ej. isLoading(), errorMessage()).
Servicio dedicado ProjectService usando HttpClient.
Criterios de aceptación:
Dado que el usuario está en el formulario de creación de una tarea para un proyecto activo, cuando completa los campos obligatorios ('title', 'assignee') con datos validos y presiona guardar, entonces el sistema envía la petición al backend, recibe la tarea creada y redirige al listado de tareas del proyecto.
Dado el formulario de creación de tarea, cuando el usuario ingresa el valor 0 en el campo de "Horas estimadas", entonces el botón de guardar se deshabilita y aparece un mensaje indicando que las horas deben ser mayores a 0.
Dado un proyecto con estado CLOSED, cuando el usuario intenta navegar a la pantalla de creación de tareas de ese proyecto, entonces la vista bloquea el formulario y muestra un mensaje informando que "No se pueden agregar tareas a un proyecto cerrado".
```
### Restricciones técnicas:
- El servicio debe llamarse TaskService y vivir en src/app/services/
- El componente debe ser standalone con ChangeDetectionStrategy.OnPush
- Manejar estados de carga, error y lista vacía en el template  
### Formato de salida: 
Aquí necesitamos los ts y los html (como usamos tw y NG aca va también la estética) y probemos a realizar un test para pasar los criterios de aceptación de manera automatica con el test.

## Segundo mensaje
Tenemos errores en algunos puntos
Dentro de create-task.component.ts
title: ['', [Validators.required, Validators.-->trim<--]]
Property 'trim' does not exist on type 'typeof Validators'
Cuando usamos el trim, en todos los caso tenemos el mismo error.
--> Resolucion: no usamos trim

Dentro de task-create.component.spec.ts
Tenemos un problema con jasmine.
Cannot find name 'jasmine'.
Esta seria una llibreria ?? o que estariamos utilizando
--> Esta usando Vitest, cambiamos la estreuctura del test para que funcione con Vitest
#### Contenido de la clase anterioir:
```
/// <reference types="jasmine" />
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaskCreateComponent } from './create-task.component';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let mockTaskService: any;
  let mockProjectService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockTaskService = { createTask: jasmine.createSpy('createTask').and.returnValue(of({ id: 1 })) };
    mockProjectService = { getProjectById: jasmine.createSpy('getProjectById').and.returnValue(of({ status: 'ACTIVE' })) };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectService, useValue: mockProjectService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Criterio 1: Debe enviar petición y redirigir si el formulario es válido en proyecto ACTIVO', () => {
    component.taskForm.patchValue({ title: 'Test Task', estimatedHours: 5, assignee: 'Dev' });
    
    component.onSubmit();

    expect(mockTaskService.createTask).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects', 1, 'tasks']);
  });

  it('Criterio 2: El botón guardar debe deshabilitarse y dar error si horas estimadas es 0', () => {
    component.taskForm.patchValue({ title: 'Test', estimatedHours: 0, assignee: 'Dev' });
    fixture.detectChanges();

    // El control tiene error de 'min'
    expect(component.taskForm.get('estimatedHours')?.hasError('min')).toBe(true);
    // El formulario entero es inválido
    expect(component.taskForm.invalid).toBe(true);
  });

  it('Criterio 3: Debe bloquear formulario y mostrar mensaje si el proyecto está CLOSED', () => {
    // Simulamos que el proyecto está cerrado
    mockProjectService.getProjectById.and.returnValue(of({ status: 'CLOSED' }));
    
    // Forzamos el reinicio de ngOnInit para probar la carga
    component.ngOnInit(); 
    fixture.detectChanges();

    expect(component.isProjectClosed()).toBe(true);
    expect(component.taskForm.disabled).toBe(true);
  });
});
```