// src/app/pages/aluno-list/aluno-list.ts
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { Aluno } from '../../models/aluno';
// --- NOVO ---
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  // --- NOVO ---
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './aluno-list.html',
  styleUrls: ['./aluno-list.css', './aluno-card.css']
})
export class AlunoList implements OnInit {

    // Usando Signal para a lista de alunos
    alunos: WritableSignal<Aluno[]> = signal([]);
    // --- NOVO: Formulário para os filtros ---
    formFiltro!: FormGroup;

    constructor(
      private alunoService: AlunoService,
      private router: Router,
      private fb: FormBuilder // --- NOVO ---
    ) { }

    ngOnInit(): void {
        // --- NOVO: Inicializa form de filtro ---
        this.formFiltro = this.fb.group({
          busca: [''] // Campo único para buscar nome ou matrícula
        });

        this.carregarAlunos(); // Carga inicial

        // --- NOVO: Listener para auto-filtrar ao digitar ---
        this.formFiltro.get('busca')?.valueChanges.pipe(
          debounceTime(400), // Espera 400ms após o usuário parar de digitar
          distinctUntilChanged() // Só busca se o valor mudou
        ).subscribe(valor => {
          this.filtrarAlunos();
        });
    }

    // --- ATUALIZADO: Método de carga agora usa o filtro ---
    carregarAlunos(filtros?: { nome?: string, matricula?: string }): void {
        this.alunoService.findAll(filtros).subscribe({
            next: (data) => { this.alunos.set(data); }, // Atualiza o signal
            error: (err) => {
                console.error('Erro ao carregar alunos:', err);
                if (err.status === 401 || err.status === 403) {
                    this.router.navigate(['/login']);
                }
            }
        });
    }

    // --- NOVO: Método para acionar a busca ---
    filtrarAlunos(): void {
      const valorBusca = this.formFiltro.get('busca')?.value;

      // Simples heurística: se for só número, busca por matrícula, senão, por nome
      const eMatricula = /^\d+$/.test(valorBusca);

      const filtros = {
        nome: eMatricula ? undefined : valorBusca,
        matricula: eMatricula ? valorBusca : undefined
      };

      this.carregarAlunos(filtros);
    }

    // Navega para o Hub de Detalhes do Aluno
    verDetalhes(id: number): void {
      this.router.navigate(['/alunos/detalhe', id]);
    }

    // Pega as iniciais para o avatar
    getIniciais(nome: string): string {
      if (!nome) return '?';
      const partes = nome.split(' ');
      if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
}
