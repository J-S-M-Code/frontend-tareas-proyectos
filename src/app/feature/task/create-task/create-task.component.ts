import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { TaskRequest, Project } from '../../../models/task.model';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    InputNumberModule, 
    ButtonModule,
    MessageModule,
    SelectModule
  ],
  templateUrl: './create-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  // Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isProjectClosed = signal<boolean>(false);
  projects = signal<Project[]>([]); 
  successMessage = signal<string | null>(null);
  
  taskForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      projectId: [null, [Validators.required]], // Ahora el proyecto es parte del formulario
      title: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/[\S]/)]],
      estimatedHours: [{value: null, disabled: true}, [Validators.required, Validators.min(1)]],
      assignee: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/[\S]/)]]
    });
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    // Asumimos que crearás este endpoint en tu backend: GET /projects
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de proyectos.');
        this.isLoading.set(false);
      }
    });
  }

  // Método que se dispara cuando el usuario elige un proyecto en el dropdown
  onProjectChange(event: any): void {
    const selectedProject = this.projects().find(p => p.id === event.value);
    this.errorMessage.set(null);
    
    if (selectedProject?.status === 'CLOSED') {
      this.isProjectClosed.set(true);
      // Deshabilitamos los campos si el proyecto está cerrado
      this.taskForm.get('title')?.disable();
      this.taskForm.get('estimatedHours')?.disable();
      this.taskForm.get('assignee')?.disable();
    } else {
      this.isProjectClosed.set(false);
      // Habilitamos los campos para escribir
      this.taskForm.get('title')?.enable();
      this.taskForm.get('estimatedHours')?.enable();
      this.taskForm.get('assignee')?.enable();
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isProjectClosed()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValues = this.taskForm.value;
    const now = new Date();
    const finishDate = new Date();
    finishDate.setHours(finishDate.getHours() + formValues.estimatedHours);

    const taskRequest: TaskRequest = {
      title: formValues.title.trim(),
      estimatedHours: formValues.estimatedHours,
      assignee: formValues.assignee.trim(),
      status: 'TODO',
      createdAt: now.toISOString(),
      finishedAt: finishDate.toISOString()
    };

    // Extraemos el projectId del formulario para la URL
    this.taskService.createTask(formValues.projectId, taskRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        // 1. Mostramos el mensaje de éxito
        this.successMessage.set(`¡La tarea "${formValues.title}" se creó con éxito!`);
        
        // 2. Reiniciamos el formulario, pero MANTENEMOS el proyecto seleccionado
        this.taskForm.reset({ projectId: formValues.projectId });
        
        // Ocultamos el mensaje de éxito después de 3 segundos (opcional pero buena UX)
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Ocurrió un error al guardar la tarea.');
      }
    });
  }
}