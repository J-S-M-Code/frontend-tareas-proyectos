import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, ProjectResponseDTO } from '../../../services/project.service';
import { TaskService, TaskResponseDTO } from '../../../services/task.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule, ProgressSpinnerModule, TagModule, MessageModule, SelectModule],
  templateUrl: './project-details.component.html'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  project = signal<ProjectResponseDTO | null>(null);
  tasks = signal<TaskResponseDTO[]>([]);

  // Opciones de filtrado por estado
  statuses = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Por Hacer', value: 'TODO' },
    { label: 'En Progreso', value: 'IN_PROGRESS' },
    { label: 'Completado', value: 'DONE' }
  ];
  selectedStatus = signal<string>('ALL');

  filteredTasks = computed(() => {
    const status = this.selectedStatus();
    const currentTasks = this.tasks();
    if (status === 'ALL') {
      return currentTasks;
    }
    return currentTasks.filter(t => t.status === status);
  });
  
  isLoadingProject = signal<boolean>(false);
  isLoadingTasks = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProjectDetails(Number(id));
      } else {
        this.errorMessage.set('No se especificó el ID del proyecto.');
      }
    });
  }

  loadProjectDetails(projectId: number) {
    this.isLoadingProject.set(true);
    this.errorMessage.set(null);

    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        if (data) {
          this.project.set(data);
          this.isLoadingProject.set(false);
          this.loadTasks(projectId);
        } else {
          this.errorMessage.set('El proyecto no existe.');
          this.isLoadingProject.set(false);
        }
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar los detalles del proyecto.');
        this.isLoadingProject.set(false);
      }
    });
  }

  loadTasks(projectId: number) {
    this.isLoadingTasks.set(true);
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoadingTasks.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar las tareas del proyecto.');
        this.isLoadingTasks.set(false);
      }
    });
  }

  getProjectSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PLANNED': return 'info';
      case 'CLOSED': return 'danger';
      default: return 'info';
    }
  }

  getTaskSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'DONE': return 'success';
      case 'IN_PROGRESS': return 'warn';
      case 'TODO': return 'info';
      default: return 'info';
    }
  }

  getTaskStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      TODO: 'Por Hacer',
      IN_PROGRESS: 'En Progreso',
      DONE: 'Completado'
    };
    return statusMap[status] || status;
  }
}
