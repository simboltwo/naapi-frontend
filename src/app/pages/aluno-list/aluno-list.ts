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

    constructor(private alunoService: AlunoService, private router: Router) { }

    ngOnInit(): void {
        this.carregarAlunos();
    }

    carregarAlunos(): void {
        this.alunoService.findAll().subscribe({
            next: (data) => { this.alunos = data; },
            error: (err) => {
                console.error('Erro ao carregar alunos:', err);
                if (err.status === 401 || err.status === 403) {
                    this.router.navigate(['/login']);
                }
            }
        });
    }

    navegarParaCadastro(): void {
        this.router.navigate(['/alunos/novo']);
    }

    // --- LÓGICA DE EXCLUSÃO ---
    excluir(id: number): void {
        // Pede confirmação
        if (confirm('Tem a certeza que deseja excluir este aluno? Esta ação marcará o aluno como inativo.')) {
            // Chama o serviço de exclusão
            this.alunoService.delete(id).subscribe({
                next: () => {
                    alert('Aluno excluído (inativado) com sucesso!');
                    // Recarrega a lista para remover o aluno da tabela
                    this.carregarAlunos();
                },
                error: (err) => {
                    console.error('Erro ao excluir aluno:', err);
                    alert(`Erro ao excluir: ${err.message}`);
                }
            });
        }
    }
}
