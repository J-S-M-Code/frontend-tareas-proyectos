import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService, TaskWithComments, TaskResponseDTO } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProjectResponseDTO } from '../../../services/project.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ProgressSpinnerModule, TagModule, MessageModule],
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);

  // Mode flag: if accessed via /projects/:projectId/tasks/:taskId, it's hierarchical
  isHierarchical = signal<boolean>(false);

  // Signals para las listas de los selectores
  projects = signal<ProjectResponseDTO[]>([]); 
  projectTasks = signal<TaskResponseDTO[]>([]); 

  // Signals para la selección actual
  selectedProjectId = signal<number | null>(null);
  selectedTaskId = signal<number | null>(null);

  // Signals para los datos de la tarea y estados
  taskData = signal<TaskWithComments | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pId = params.get('projectId');
      const tId = params.get('taskId');

      if (pId && tId) {
        this.isHierarchical.set(true);
        this.selectedProjectId.set(Number(pId));
        this.selectedTaskId.set(Number(tId));
        this.loadTaskDetails(Number(pId), Number(tId));
      } else {
        this.isHierarchical.set(false);
        this.loadProjects();
      }
    });
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getAllProjects().subscribe({
      next: (data: any[]) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => { 
        this.errorMessage.set('Ocurrió un error al cargar la lista de proyectos.');
        this.isLoading.set(false);
      }
    });
  }

  onProjectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const projId = Number(target.value);
    
    this.selectedProjectId.set(projId);
    this.selectedTaskId.set(null); 
    this.taskData.set(null); 
    this.projectTasks.set([]); 
    this.errorMessage.set(null);

    if (projId) {
      this.loadTasksForProject(projId);
    }
  }

  loadTasksForProject(projectId: number) {
    this.isLoading.set(true);
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (tasks: TaskResponseDTO[]) => { 
        this.projectTasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => { 
        this.errorMessage.set('Error al cargar las tareas de este proyecto.');
        this.isLoading.set(false);
      }
    });
  }

  onTaskChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const taskId = Number(target.value);
    
    this.selectedTaskId.set(taskId);
    
    if (taskId) {
      this.loadTaskDetails(this.selectedProjectId()!, taskId);
    } else {
      this.taskData.set(null);
    }
  }

  loadTaskDetails(projectId: number, taskId: number) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.taskData.set(null);

    this.taskService.getTaskDetails(projectId, taskId).subscribe({
      next: (data: TaskWithComments) => {
        if (!data.comments) {
          data.comments = [];
        }
        
        this.taskData.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.errorMessage.set('La tarea solicitada no existe o fue eliminada.');
        } else if (err.status === 400) {
          this.errorMessage.set('Los parámetros proporcionados no son válidos.');
        } else {
          this.errorMessage.set('Ocurrió un error al cargar los detalles de la tarea. Por favor, intente de nuevo.');
        }
        this.isLoading.set(false);
      }
    });
  }

  retry() {
    if (this.selectedProjectId() && this.selectedTaskId()) {
      this.loadTaskDetails(this.selectedProjectId()!, this.selectedTaskId()!);
    } else if (this.projects().length === 0) {
      this.loadProjects();
    }
  }

  clearSelection() {
    this.selectedProjectId.set(null);
    this.selectedTaskId.set(null);
    this.taskData.set(null);
    this.projectTasks.set([]);
    this.errorMessage.set(null);
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      TODO: 'Por Hacer',
      IN_PROGRESS: 'En Progreso',
      DONE: 'Completado'
    };
    return statusMap[status] || status;
  }
}