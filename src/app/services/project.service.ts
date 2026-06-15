import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Project, ProjectCreateDTO } from '../models/project.model';
import { environment } from '../environments/environment';

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface ProjectResponseDTO {
  id: number;
  name: string;
  status: ProjectStatus;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createProject(project: ProjectCreateDTO): Observable<ProjectResponseDTO> {
    return this.http.post<ProjectResponseDTO>(`${this.apiUrl}/projects`, project).pipe(
      catchError(err => {
        return throwError(() => new Error('Error al crear el proyecto.'));
      })
    );
  }

  getProjectById(projectId: number): Observable<ProjectResponseDTO | undefined> {
    return this.http.get<ProjectResponseDTO[]>(`${this.apiUrl}/projects`).pipe(
      map(projects => projects.find(p => p.id === projectId)),
      catchError(err => {
        if (err.status === 404) return throwError(() => new Error('Proyecto no encontrado'));
        return throwError(() => new Error('Error al conectar con el servidor'));
      })
    );
  }

  getAllProjects(): Observable<ProjectResponseDTO[]> {
    return this.http.get<ProjectResponseDTO[]>(`${this.apiUrl}/projects`).pipe(
      catchError(err => {
        return throwError(() => new Error('Error al conectar con el servidor'));
      })
    );
  }
}
