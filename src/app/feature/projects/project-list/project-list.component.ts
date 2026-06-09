import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProjectService, ProjectResponseDTO } from '../../../services/project.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ProgressSpinnerModule, TagModule, MessageModule],
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = signal<ProjectResponseDTO[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PLANNED': return 'info';
      case 'CLOSED': return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      PLANNED: 'Planeado',
      ACTIVE: 'Activo',
      CLOSED: 'Cerrado'
    };
    return statusMap[status] || status;
  }
}
