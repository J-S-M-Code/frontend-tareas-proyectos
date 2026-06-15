import { Component, ChangeDetectionStrategy, inject, signal, input, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentTaskService } from '../../services/comment-task.service';
import { ProjectService, ProjectResponseDTO } from '../../services/project.service';
import { TaskService, TaskResponseDTO } from '../../services/task.service';

// Módulos de PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, ButtonModule, 
    InputTextModule, TextareaModule, SelectModule, MessageModule
  ],
  templateUrl: './add-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCommentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private commentTaskService = inject(CommentTaskService);
  private destroyRef = inject(DestroyRef); 
  private route = inject(ActivatedRoute);

  // Signals para las listas de los Dropdowns
  projects = signal<ProjectResponseDTO[]>([]);
  tasks = signal<TaskResponseDTO[]>([]);

  // Signals para estados de la UI
  isProjectsLoading = signal(false);
  isTasksLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  preselectedProjectId = signal<number | null>(null);
  preselectedTaskId = signal<number | null>(null);

  // Formulario Reactivo
  form = this.fb.group({
    projectId: [{value: null as number | null, disabled: false}, Validators.required],
    taskId: [{ value: null as number | null, disabled: true }, Validators.required],
    author: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
    text: ['', [Validators.required, Validators.pattern(/.*\S.*/)]]
  });

  constructor() {
    this.form.controls.projectId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(projectId => {
        if (projectId) {
          this.loadTasks(projectId);
        } else {
          this.form.controls.taskId.reset();
          this.form.controls.taskId.disable();
          this.tasks.set([]);
        }
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pId = params['projectId'];
      const tId = params['taskId'];
      
      if (pId) {
        this.preselectedProjectId.set(Number(pId));
      }
      if (tId) {
        this.preselectedTaskId.set(Number(tId));
      }
      
      this.loadProjects();
    });
  }

  private loadProjects(): void {
    this.isProjectsLoading.set(true);
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isProjectsLoading.set(false);
        
        const pId = this.preselectedProjectId();
        if (pId) {
          this.form.patchValue({ projectId: pId });
          // If navigated hierarchically, disable project selection
          this.form.controls.projectId.disable();
        }
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de proyectos.');
        this.isProjectsLoading.set(false);
      }
    });
  }

  private loadTasks(projectId: number): void {
    this.isTasksLoading.set(true);
    this.form.controls.taskId.disable(); 
    // Only reset if we are not initializing from preselected values
    if (!this.preselectedTaskId()) {
      this.form.controls.taskId.reset();
    }

    this.taskService.getTasksByProject(projectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isTasksLoading.set(false);
        
        const tId = this.preselectedTaskId();
        if (tId && this.form.getRawValue().projectId === this.preselectedProjectId()) {
          this.form.patchValue({ taskId: tId });
          // If navigated hierarchically, leave task disabled
        } else {
          // If manual selection, enable it
          this.form.controls.taskId.enable();
        }
      },
      error: () => {
        this.errorMessage.set('Error al cargar las tareas del proyecto.');
        this.isTasksLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { projectId, taskId, text, author } = this.form.getRawValue();

    this.commentTaskService.addComment(projectId!, taskId!, { text: text!, author: author! })
      .subscribe({
        next: () => {
          this.successMessage.set('Comentario registrado con éxito.');
          this.form.reset({
             projectId: this.preselectedProjectId(),
             taskId: this.preselectedTaskId()
          });
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Error al intentar guardar el comentario.');
          this.isSubmitting.set(false);
        }
      });
  }
}