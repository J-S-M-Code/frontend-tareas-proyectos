import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly apiUrl = 'http://localhost:8080/projects';

  addComment(projectId: number, taskId: number, comment: TaskCommentRequestDTO): Observable<CommentResponseDTO> {
    const url = `${this.apiUrl}/${projectId}/tasks/${taskId}/comments`;
    return this.http.post<CommentResponseDTO>(url, comment);
  }
}