import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.post<ProjectResponseDTO>(`${this.apiUrl}/projects`, project);
  }

  getProjectById(projectId: number): Observable<ProjectResponseDTO> {
    return this.http.get<ProjectResponseDTO>(`${this.apiUrl}/${projectId}`);
  }

  getAllProjects(): Observable<ProjectResponseDTO[]> {
    return this.http.get<ProjectResponseDTO[]>(this.apiUrl);
  }
}
