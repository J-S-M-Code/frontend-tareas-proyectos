import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRequest } from '../models/task.model';

export interface TaskResponseDTO {
  id: number;
  title: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/projects'; // Ajustar según tu environment

  createTask(projectId: number, task: TaskRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/tasks`, task);
  }
  getTasksByProject(projectId: number): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/${projectId}/tasks`);
  }
}