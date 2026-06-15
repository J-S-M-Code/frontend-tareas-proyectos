import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-tasks-by-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  templateUrl: './tasks-by-status.component.html'
})
export class TasksByStatusComponent implements OnInit {
  private taskService = inject(TaskService);

  // Opciones permitidas por dominio
  statuses = [
    { label: 'Por Hacer', value: 'TODO' },
    { label: 'En Progreso', value: 'IN_PROGRESS' },
    { label: 'Completado', value: 'DONE' }
  ];

  // Signals para manejar el estado
  selectedStatus = signal<string>('TODO');
  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadTasks(this.selectedStatus());
  }

  // Ahora recibe directamente el string del select nativo
  onStatusChange(newStatus: string) {
    this.selectedStatus.set(newStatus);
    this.loadTasks(this.selectedStatus());
  }

  loadTasks(status: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.tasks.set([]);

    this.taskService.getTasksByStatus(status).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Ocurrió un error al obtener las tareas. Por favor, verifique su conexión o intente más tarde.');
        this.isLoading.set(false);
      }
    });
  }

  retry() {
    this.loadTasks(this.selectedStatus());
  }
}