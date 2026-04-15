import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service'; // Asumimos que existe
import { TaskRequest } from '../../../models/task.model';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    InputNumberModule, 
    ButtonModule,
    MessageModule
  ],
  templateUrl: './create-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals para el manejo de estado
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isProjectClosed = signal<boolean>(false);
  
  projectId!: number;
  taskForm!: FormGroup;

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.initForm();
    this.checkProjectStatus();
  }

private initForm(): void {
    // Usamos una expresión regular /[\S]/ que obliga a que exista al menos un carácter visible (no espacio)
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/[\S]/)]],
      estimatedHours: [null, [Validators.required, Validators.min(1)]],
      assignee: ['', [Validators.required, Validators.pattern(/[\S]/)]]
    });
  }

  private checkProjectStatus(): void {
    this.isLoading.set(true);
    // Verificamos el estado del proyecto para bloquear la vista si está CLOSED
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        if (project.status === 'CLOSED') {
          this.isProjectClosed.set(true);
          this.taskForm.disable(); // Bloqueamos todo el formulario
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo verificar el estado del proyecto.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.isProjectClosed()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValues = this.taskForm.value;
    
    // Generamos las fechas requeridas por el DTO del backend
    const now = new Date();
    const finishDate = new Date();
    finishDate.setHours(finishDate.getHours() + formValues.estimatedHours);

    const taskRequest: TaskRequest = {
      title: formValues.title,
      estimatedHours: formValues.estimatedHours,
      assignee: formValues.assignee,
      status: 'TODO', // Regla de negocio inicializada
      createdAt: now.toISOString(),
      finishedAt: finishDate.toISOString()
    };

    this.taskService.createTask(this.projectId, taskRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/projects', this.projectId, 'tasks']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Manejamos el 409 Conflict o 400 Bad Request
        this.errorMessage.set(err.error?.error || 'Ocurrió un error al guardar la tarea.');
      }
    });
  }
}