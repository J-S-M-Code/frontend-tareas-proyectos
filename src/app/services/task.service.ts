import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskRequest, Task, TaskStatus} from '../models/task.model';
import { environment } from '../environments/environment';
import { Project } from '../models/project.model';

export interface TaskResponseDTO {
  id: number;
  title: string;
  status: string;
}

export interface TaskComment {
  id: number;
  task: Task;
  text: string;
  author: string;
  createdAt: string;
}

export interface TaskWithComments {
  id: number;
  title: string;
  project: Project;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  finishedAt?: string;
  comments: TaskComment[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createTask(projectId: number, task: TaskRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/tasks`, task).pipe(
      catchError(err => {
        return throwError(() => new Error('Error al crear la tarea.'));
      })
    );
  }

  getTasksByProject(projectId: number): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/projects/${projectId}/tasks`).pipe(
      catchError(err => {
        if (err.status === 404) return throwError(() => new Error('Proyecto no encontrado para cargar tareas'));
        return throwError(() => new Error('Error al conectar con el servidor'));
      })
    );
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/${status}`).pipe(
      catchError(err => {
        return throwError(() => new Error('Error al conectar con el servidor'));
      })
    );
  }

  getTaskDetails(projectId: number, taskId: number): Observable<TaskWithComments> {
    return this.http.get<TaskWithComments>(
      `${this.apiUrl}/projects/${projectId}/tasks/${taskId}`
    ).pipe(
      catchError(err => {
        if (err.status === 404) return throwError(() => new Error('La tarea solicitada no existe o fue eliminada'));
        return throwError(() => new Error('Error al conectar con el servidor'));
      })
    );
  }
}