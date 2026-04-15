import { Routes } from '@angular/router';
import { AppComponent } from './app'; 
import { CreateProjectComponent } from './feature/projects/create-project/create-project.component'; 
import { TaskCreateComponent } from './feature/task/create-task/create-task.component'; 

export const routes: Routes = [
  { 
    path: '', 
    component: AppComponent,
    title: 'Inicio - Gestión de Tareas y Proyectos' // Título opcional para la pestaña del navegador
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
  // Redirección comodín en caso de rutas no encontradas (Buena práctica)
  { 
    path: '**', 
    redirectTo: '' 
  }
];