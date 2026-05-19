import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { CreateProjectComponent } from './feature/projects/create-project/create-project.component';
import { TaskCreateComponent } from './feature/task/create-task/create-task.component';
import { AddCommentComponent } from './feature/add-comment/add-comment.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'Inicio - Gestión de Tareas y Proyectos'
  },
  {
    path: 'projects/create',
    component: CreateProjectComponent,
    title: 'Crear Proyecto'
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
    path: '**',
    redirectTo: ''
  }
];