// src/app/app.ts

import { Component, signal } from '@angular/core';
// Importa Router e CommonModule
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf
import { Menu } from './shared/menu/menu';
import { filter } from 'rxjs/operators'; // Para filtrar eventos de navegação

@Component({
  selector: 'app-root',
  standalone: true,
  // Adiciona CommonModule aos imports
  imports: [RouterOutlet, Menu, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Plataforma NAAPI');
  // Sinal para controlar a visibilidade do menu
  protected showMenu = signal(false);

  constructor(private router: Router) {
    // Escuta as mudanças de rota
    this.router.events.pipe(
      // Filtra apenas os eventos de fim de navegação
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Atualiza o sinal: mostra o menu se a URL NÃO for '/login'
      this.showMenu.set(event.urlAfterRedirects !== '/login');
      console.log('Rota mudou:', event.urlAfterRedirects, 'Mostrar Menu:', this.showMenu()); // Debug
    });
  }
}
