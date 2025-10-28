import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Adiciona Router
import { CommonModule } from '@angular/common';
// Importa o Auth Service se precisar deslogar (limpar credenciais não faz sentido em Basic Auth)
// import { Auth } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css', // <<< Apontar para o CSS
})
export class Menu {
    menuItems = [
        // Removido /login daqui, pois o menu não aparece lá
        { path: '/alunos', title: 'Alunos' },
        { path: '/cursos', title: 'Cursos' },
        // Adicionar outras seções aqui...
    ];

    // Construtor (opcional para logout)
    constructor(private router: Router /*, private authService: Auth */) {}

    // Método Logout (simples redirecionamento, pois Basic Auth não tem "sessão" no cliente)
    logout(event: Event): void {
      event.preventDefault(); // Impede o link de navegar para #
      console.log('Redirecionando para login...');
      // Idealmente, limparia tokens/storage se fosse JWT
      this.router.navigate(['/login']);
    }
}
