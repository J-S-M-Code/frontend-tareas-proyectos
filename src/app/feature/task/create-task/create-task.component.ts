import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
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
    RouterModule,
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
  private route = inject(ActivatedRoute);

  // Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isProjectClosed = signal<boolean>(false);
  projects = signal<Project[]>([]); 
  successMessage = signal<string | null>(null);
  
  taskForm!: FormGroup;
  preselectedProjectId = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();
    
    // Check if we have a projectId in query params
    this.route.queryParams.subscribe(params => {
      const pId = params['projectId'];
      if (pId) {
        this.preselectedProjectId.set(Number(pId));
      }
      this.loadProjects();
    });
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      projectId: [null, [Validators.required]],
      title: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/.*\S.*/)]],
      estimatedHours: [{value: null, disabled: true}, [Validators.required, Validators.min(1)]],
      assignee: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/.*\S.*/)]]
    });
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
        
        // If we have a preselected projectId, set it and trigger the change
        const preselectedId = this.preselectedProjectId();
        if (preselectedId) {
          this.taskForm.patchValue({ projectId: preselectedId });
          // Optionally disable it so user can't change it if accessed hierarchically
          // this.taskForm.get('projectId')?.disable(); 
          this.onProjectChange({ value: preselectedId });
        }
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de proyectos.');
        this.isLoading.set(false);
      }
    });
  }

  onProjectChange(event: any): void {
    // If event comes from manual select, it has a value. If it comes from patchValue, it might be the raw value depending on PrimeNG
    const val = event.value !== undefined ? event.value : event;
    const selectedProject = this.projects().find(p => p.id === val);
    this.errorMessage.set(null);
    
    if (selectedProject?.status === 'CLOSED') {
      this.isProjectClosed.set(true);
      this.taskForm.get('title')?.disable();
      this.taskForm.get('estimatedHours')?.disable();
      this.taskForm.get('assignee')?.disable();
    } else {
      this.isProjectClosed.set(false);
      this.taskForm.get('title')?.enable();
      this.taskForm.get('estimatedHours')?.enable();
      this.taskForm.get('assignee')?.enable();
    }
  }

  onSubmit(): void {
    // getRawValue to get value of disabled controls if any
    const formValues = this.taskForm.getRawValue();
    
    if (this.taskForm.invalid || this.isProjectClosed()) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

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

    this.taskService.createTask(formValues.projectId, taskRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(`¡La tarea "${formValues.title}" se creó con éxito!`);
        
        this.taskForm.reset({ projectId: formValues.projectId });
        // After reset, make sure fields are re-enabled if project is not closed
        this.onProjectChange({ value: formValues.projectId });
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Ocurrió un error al guardar la tarea.');
      }
    });
  }
}