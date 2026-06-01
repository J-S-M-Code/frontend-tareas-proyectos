import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getProjectById(projectId: number): Observable<ProjectResponseDTO | undefined> {
    return this.http.get<ProjectResponseDTO[]>(`${this.apiUrl}/projects`).pipe(
      map(projects => projects.find(p => p.id === projectId))
    );
  }

  getAllProjects(): Observable<ProjectResponseDTO[]> {
    return this.http.get<ProjectResponseDTO[]>(`${this.apiUrl}/projects`);
  }
}
