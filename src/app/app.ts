import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, ButtonModule],
  template: `
    <div class="bg-white shadow-md p-4 mb-6">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
        
        <a pButton label="Inicio" icon="pi pi-home" [routerLink]="['/']" 
           class="p-button-text p-button-lg w-full sm:w-auto"></a>

        <a pButton label="Crear Proyecto" icon="pi pi-folder-plus" [routerLink]="['/projects/create']" 
           class="p-button-primary p-button-lg w-full sm:w-auto"></a>

        <a pButton label="Crear Tarea" icon="pi pi-check-square" [routerLink]="['/tasks/create']" 
           class="p-button-info p-button-lg w-full sm:w-auto"></a>

      </div>
    </div>

    <main class="max-w-5xl mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}