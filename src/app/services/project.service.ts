import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectCreateDTO } from '../models/project.model';

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
  // Asegúrate de que esta URL coincida con la configuración de tu entorno
  private readonly apiUrl = 'http://localhost:8080/projects';

  createProject(project: ProjectCreateDTO): Observable<ProjectResponseDTO> {
    return this.http.post<ProjectResponseDTO>(this.apiUrl, project);
  }

  getProjectById(projectId: number): Observable<ProjectResponseDTO> {
    return this.http.get<ProjectResponseDTO>(`${this.apiUrl}/${projectId}`);
  }

  getAllProjects(): Observable<ProjectResponseDTO[]> {
    return this.http.get<ProjectResponseDTO[]>(this.apiUrl);
  }
}
