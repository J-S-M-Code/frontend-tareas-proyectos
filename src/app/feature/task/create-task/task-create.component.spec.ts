import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaskCreateComponent } from './create-task.component';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let mockTaskService: any;
  let mockProjectService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockTaskService = { createTask: vi.fn().mockReturnValue(of({ id: 1 })) };
    
    // Ahora mockeamos el nuevo método getAllProjects()
    mockProjectService = { 
      getAllProjects: vi.fn().mockReturnValue(of([
        { id: 1, name: 'Proyecto Activo', status: 'ACTIVE' },
        { id: 2, name: 'Proyecto Cerrado', status: 'CLOSED' }
      ])) 
    };
    
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectService, useValue: mockProjectService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara el ngOnInit y carga los proyectos
  });

  it('Criterio 1: Debe enviar petición, mostrar mensaje de éxito y limpiar el formulario (manteniendo el proyecto) si es válido', () => {
    component.onProjectChange({ value: 1 });
    component.taskForm.patchValue({ 
      projectId: 1, 
      title: 'Test Task', 
      estimatedHours: 5, 
      assignee: 'Dev' 
    });
    
    component.onSubmit();

    // Verificamos que se llamó al servicio
    expect(mockTaskService.createTask).toHaveBeenCalledWith(1, expect.any(Object));
    // Verificamos que el router ya NO se llama
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    // Verificamos que se generó el mensaje de éxito
    expect(component.successMessage()).toContain('creó con éxito');
    // Verificamos que el título se limpió, pero el proyecto se mantuvo
    expect(component.taskForm.get('title')?.value).toBeNull();
    expect(component.taskForm.get('projectId')?.value).toBe(1);
  });

  it('Criterio 3: Debe bloquear formulario y mostrar mensaje si el usuario selecciona un proyecto CLOSED', () => {
    // Simulamos que el usuario selecciona el proyecto cerrado (ID 2)
    component.onProjectChange({ value: 2 });
    fixture.detectChanges();

    expect(component.isProjectClosed()).toBe(true);
    expect(component.taskForm.get('title')?.disabled).toBe(true);
  });
});