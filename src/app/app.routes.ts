import { Routes } from '@angular/router';
import { CreateProjectComponent } from './feature/projects/create-project/create-project.component';

export const routes: Routes = [
  // Cuando la ruta está vacía (localhost:4200/), carga el componente de crear
  {
    path: '',
    component: CreateProjectComponent,
  },
  // Opcional: dejamos la ruta explícita armada para el futuro
  {
    path: 'proyectos/crear',
    component: CreateProjectComponent,
  },
  // Si el usuario ingresa una URL que no existe, lo mandamos a la principal
  {
    path: '**',
    redirectTo: '',
  },
];
