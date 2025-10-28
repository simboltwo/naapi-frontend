// src/app/pages/aluno-list/aluno-list.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, *ngFor
import { AlunoService } from '../../services/aluno'; // <-- Importa o Service renomeado
import { Aluno as AlunoModel } from '../../models/aluno';

@Component({
  selector: 'app-aluno-list',
  standalone: true, // Certifica que é standalone
  imports: [CommonModule],
  templateUrl: './aluno-list.html',
  styleUrl: './aluno-list.css',
})
export class AlunoList {

    alunos: AlunoModel[] = []; // Usa o Model Aluno

    // Injeta o Service AlunoService (que está no ficheiro services/aluno)
    constructor(private alunoService: AlunoService) { }

    // ... (Métodos ngOnInit, carregarAlunos, etc. precisam de ser adicionados para fazer funcionar)
}
