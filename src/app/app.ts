import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- Importamos RouterOutlet en lugar del componente directamente
  template: `
    <main class="min-h-screen bg-slate-50 p-4 md:p-8">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {}
