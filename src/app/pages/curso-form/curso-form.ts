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
          console.error('Erro ao salvar:', err);
          let mensagemErro = 'Ocorreu um erro ao salvar.'; // Mensagem padrão

          if (err.status === 422 && err.error?.errors) {
            // Se for erro de validação (422) e tiver a lista de erros do backend
            mensagemErro = 'Por favor, corrija os seguintes erros:\n';
            err.error.errors.forEach((fieldError: { fieldName: string, message: string }) => {
              mensagemErro += `- ${fieldError.fieldName}: ${fieldError.message}\n`;
              // Opcional: Marcar o campo específico no formulário como inválido
              const control = this.form.get(fieldError.fieldName);
              if (control) {
                control.setErrors({ 'backendError': fieldError.message });
              }
            });
          } else if (err.error?.message) {
            // Se for outro erro da API com mensagem
            mensagemErro = err.error.message;
          } else if (err.message) {
            // Se for um erro geral do HTTP
            mensagemErro = err.message;
          }

          alert(mensagemErro); // Ou usar um serviço de notificação mais elegante
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
      error: (err) => {
        console.error('Erro ao salvar curso:', err);
        let mensagemErro = 'Ocorreu um erro ao salvar o curso.'; // Padrão

        if (err.status === 422 && err.error?.errors) {
          mensagemErro = 'Por favor, corrija os seguintes erros:\n';
          err.error.errors.forEach((fieldError: { fieldName: string, message: string }) => {
            mensagemErro += `- ${fieldError.fieldName}: ${fieldError.message}\n`;
            const control = this.form.get(fieldError.fieldName);
            if (control) {
              // Adiciona o erro vindo do backend ao controle do formulário
              control.setErrors({ ...(control.errors || {}), 'backendError': fieldError.message });
            }
          });
          alert(mensagemErro); // Mostra resumo em alert
          this.form.markAllAsTouched(); // Garante que o erro do backend apareça no campo
        } else if (err.error?.message) {
          mensagemErro = err.error.message; // Mensagem de erro de negócio (ex: nome duplicado)
          alert(`Erro: ${mensagemErro}`);
        } else {
          alert(mensagemErro); // Erro genérico
        }
      }
    });
  }
}
