import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Adiciona Router
import { CursoService } from '../../services/curso';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-curso-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './curso-list.html',
  styleUrls: ['./curso-list.css']
})
export class CursoList implements OnInit {

  cursos: Curso[] = [];

  constructor(private cursoService: CursoService, private router: Router) { }

  ngOnInit(): void {
    this.carregarCursos();
  }

  carregarCursos(): void {
    this.cursoService.findAll().subscribe({
      next: (data) => this.cursos = data,
      error: (err) => {
        console.error('Erro ao carregar cursos', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      this.cursoService.delete(id).subscribe({
        next: () => {
          alert('Curso excluído com sucesso!');
          this.carregarCursos(); // Atualiza a lista
        },
        error: (err) => alert(`Erro ao excluir: ${err.error?.message || err.message}`)
      });
    }
  }
}
