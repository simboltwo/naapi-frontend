import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../services/curso';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './curso-form.html',
  styleUrls: ['./curso-form.css']
})
export class CursoForm implements OnInit {

  form!: FormGroup;
  cursoId: number | null = null;
  isEdicao: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cursoId = +idParam;
      this.isEdicao = true;
      this.carregarCurso(this.cursoId);
    }
  }

  carregarCurso(id: number): void {
    this.cursoService.findById(id).subscribe({
      next: (curso) => this.form.patchValue(curso),
      error: (err) => {
        alert('Curso não encontrado!');
        this.router.navigate(['/cursos']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cursoDados = this.form.value;
    const operacao = this.isEdicao
      ? this.cursoService.update(this.cursoId!, cursoDados)
      : this.cursoService.insert(cursoDados);

    operacao.subscribe({
      next: () => {
        alert(`Curso ${this.isEdicao ? 'atualizado' : 'cadastrado'}!`);
        this.router.navigate(['/cursos']);
      },
      error: (err) => alert(`Erro ao salvar: ${err.error?.message || err.message}`)
    });
  }
}
