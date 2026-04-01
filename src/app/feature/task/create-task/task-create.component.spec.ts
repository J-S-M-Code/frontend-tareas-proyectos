import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaskCreateComponent } from './create-task.component';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest'; // Importamos 'vi' de vitest

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let mockTaskService: any;
  let mockProjectService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Reemplazamos jasmine por vi.fn()
    mockTaskService = { createTask: vi.fn().mockReturnValue(of({ id: 1 })) };
    mockProjectService = { getProjectById: vi.fn().mockReturnValue(of({ status: 'ACTIVE' })) };
    mockRouter = { navigate: vi.fn() };

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

    expect(component.taskForm.get('estimatedHours')?.hasError('min')).toBe(true);
    expect(component.taskForm.invalid).toBe(true);
  });

  it('Criterio 3: Debe bloquear formulario y mostrar mensaje si el proyecto está CLOSED', () => {
    mockProjectService.getProjectById.mockReturnValue(of({ status: 'CLOSED' }));
    
    component.ngOnInit(); 
    fixture.detectChanges();

    expect(component.isProjectClosed()).toBe(true);
    expect(component.taskForm.disabled).toBe(true);
  });
});