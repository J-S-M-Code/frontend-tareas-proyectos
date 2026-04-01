import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectCreateDTO } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  // Asegúrate de que esta URL coincida con la configuración de tu entorno
  private readonly apiUrl = 'http://localhost:8080/projects';

  createProject(project: ProjectCreateDTO): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }
}
