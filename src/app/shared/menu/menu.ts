// src/app/shared/menu/menu.ts

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule], // Adicionar RouterModule para links
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
    menuItems = [
        { path: '/alunos', title: 'Alunos' },
        { path: '/relatorios', title: 'Relatórios' }, // Assumindo que irás criar esta rota depois
        { path: '/login', title: 'Login' }
    ];
}
