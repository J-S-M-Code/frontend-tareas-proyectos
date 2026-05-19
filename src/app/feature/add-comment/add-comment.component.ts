import { Component, ChangeDetectionStrategy, inject, signal, input, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
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
    CommonModule, ReactiveFormsModule, ButtonModule, 
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
  private destroyRef = inject(DestroyRef); // Para desuscribir observables automáticamente

  // Signals para las listas de los Dropdowns
  projects = signal<ProjectResponseDTO[]>([]);
  tasks = signal<TaskResponseDTO[]>([]);

  // Signals para estados de la UI
  isProjectsLoading = signal(false);
  isTasksLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulario Reactivo
  form = this.fb.group({
    projectId: [null as number | null, Validators.required],
    // El control de tareas inicia deshabilitado (como dicta la SPEC)
    taskId: [{ value: null as number | null, disabled: true }, Validators.required],
    author: ['', [Validators.required, Validators.pattern(/[\S]/)]],
    text: ['', [Validators.required, Validators.pattern(/[\S]/)]]
  });

  constructor() {
    // Escuchamos reactivamente cuando el usuario selecciona un proyecto distinto
    this.form.controls.projectId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(projectId => {
        if (projectId) {
          this.loadTasks(projectId);
        } else {
          // Si limpia el proyecto, limpiamos y deshabilitamos tareas
          this.form.controls.taskId.reset();
          this.form.controls.taskId.disable();
          this.tasks.set([]);
        }
      });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isProjectsLoading.set(true);
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        // Podríamos filtrar aquí para mostrar solo proyectos NO CERRADOS si el negocio lo dicta
        this.projects.set(data);
        this.isProjectsLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de proyectos.');
        this.isProjectsLoading.set(false);
      }
    });
  }

  private loadTasks(projectId: number): void {
    this.isTasksLoading.set(true);
    this.form.controls.taskId.disable(); // Bloqueamos mientras carga
    this.form.controls.taskId.reset();

    this.taskService.getTasksByProject(projectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.form.controls.taskId.enable(); // Habilitamos al recibir datos
        this.isTasksLoading.set(false);
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
          this.form.reset();
          // Al hacer reset, el listener de valueChanges deshabilitará el dropdown de tareas automáticamente
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Error al intentar guardar el comentario.');
          this.isSubmitting.set(false);
        }
      });
  }
}