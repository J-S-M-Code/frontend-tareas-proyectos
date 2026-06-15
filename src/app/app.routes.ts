import { Routes } from '@angular/router';
import { ProjectListComponent } from './feature/projects/project-list/project-list.component';
import { ProjectDetailsComponent } from './feature/projects/project-details/project-details.component';
import { CreateProjectComponent } from './feature/projects/create-project/create-project.component';
import { TaskCreateComponent } from './feature/task/create-task/create-task.component';
import { AddCommentComponent } from './feature/add-comment/add-comment.component';
import { TasksByStatusComponent } from './feature/task/tasks-by-status/tasks-by-status.component';
import { TaskDetailsComponent } from './feature/task/task-details/task-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    title: 'Inicio - Proyectos'
  },
  {
    path: 'projects/create',
    component: CreateProjectComponent,
    title: 'Crear Proyecto'
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
    title: 'Detalles del Proyecto'
  },
  {
    path: 'projects/:projectId/tasks/:taskId',
    component: TaskDetailsComponent,
    title: 'Detalles de Tarea'
  },
  {
    path: 'tasks/create',
    component: TaskCreateComponent,
    title: 'Crear Tarea'
  },
  { 
    path: 'comment/create',
    component: AddCommentComponent,
    title: 'Agregar Comentario'
  },
  { 
    path: 'tasks/by-status', 
    component: TasksByStatusComponent,
    title: 'Tareas por Estado'
  },
  { 
    path: 'tasks/details', 
    component: TaskDetailsComponent,
    title: 'Buscar Tarea'
  },
  {
    path: '**',
    redirectTo: ''
  }
];