import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TaskCommentRequestDTO {
  text: string;
  author: string;
}

export interface CommentResponseDTO {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CommentTaskService {
  private readonly http = inject(HttpClient);
  // Asegúrate de que esta URL coincida con la configuración de tu entorno
  private readonly apiUrl = environment.apiUrl;

  addComment(projectId: number, taskId: number, comment: TaskCommentRequestDTO): Observable<CommentResponseDTO> {
    const url = `${this.apiUrl}/projects/${projectId}/tasks/${taskId}/comments`;
    return this.http.post<CommentResponseDTO>(url, comment);
  }
}