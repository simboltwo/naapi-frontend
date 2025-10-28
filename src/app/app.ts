// src/app/app.ts (Adiciona o RouterOutlet e o Menu)

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './shared/menu/menu'; // Componente Menu

@Component({
  selector: 'app-root',
  standalone: true, // Confirma que é standalone
  imports: [RouterOutlet, Menu], // Importa o Menu e o RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Plataforma NAAPI');
}
