import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importar Router e RouterModule
import { AlunoService } from '../../services/aluno'; // Service renomeado
import { Aluno } from '../../models/aluno'; // Model

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aluno-list.html',
  styleUrl: './aluno-list.css',
})
export class AlunoList implements OnInit {

    alunos: Aluno[] = [];

    // Injetar o Service e o Router
    constructor(private alunoService: AlunoService, private router: Router) { }

    ngOnInit(): void {
        this.carregarAlunos();
    }

    carregarAlunos(): void {
        this.alunoService.findAll().subscribe({
            next: (data) => {
                this.alunos = data;
            },
            error: (err) => {
                console.error('Erro ao carregar alunos:', err);
                // Se o Basic Auth falhar (401), redireciona para o login
                if (err.status === 401 || err.status === 403) {
                    this.router.navigate(['/login']);
                }
            }
        });
    }

    navegarParaCadastro(): void {
        this.router.navigate(['/alunos/novo']);
    }

    excluir(id: number): void {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            // A implementação do DELETE ficará no service AlunoService
            alert('Ação de DELETE ainda não implementada no Service, mas seria executada aqui.');
        }
    }
}
