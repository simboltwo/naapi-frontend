// src/app/shared/menu/menu.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
    // Foco apenas em Alunos
    menuItems = [
        { path: '/alunos', title: 'Alunos' },
        // { path: '/cursos', title: 'Cursos' }, // Removido
    ];

    constructor(private router: Router) {}

    logout(event: Event): void {
      event.preventDefault();
      this.router.navigate(['/login']);
    }
}
