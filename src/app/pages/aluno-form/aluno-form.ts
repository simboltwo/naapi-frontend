import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { CursoService } from '../../services/curso';
import { TurmaService, Turma } from '../../services/turma';
import { DiagnosticoService } from '../../services/diagnostico';
import { Aluno } from '../../models/aluno';
import { Curso } from '../../models/curso';
import { Diagnostico } from '../../models/diagnostico';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  // Importa os módulos necessários
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './aluno-form.html',
  styleUrls: ['./aluno-form.css'],
})
export class AlunoForm implements OnInit {

  form!: FormGroup;
  alunoId: number | null = null;
  isEdicao: boolean = false;

  cursos: Curso[] = [];
  turmas: Turma[] = [];
  diagnosticos: Diagnostico[] = [];

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private turmaService: TurmaService,
    private diagnosticoService: DiagnosticoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCombos();

    // --- LÓGICA DE CARREGAMENTO PARA EDIÇÃO ---
    // Pega o 'id' da URL (definido em app.routes.ts)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.alunoId = +idParam; // Converte para número
      this.isEdicao = true;
      console.log('Modo Edição - ID:', this.alunoId); // Debug
      // Se for edição, busca os dados do aluno na API
      this.carregarDadosAluno(this.alunoId);
    } else {
        console.log('Modo Cadastro'); // Debug
    }
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      nomeSocial: [''],
      matricula: ['', Validators.required],
      prioridadeAtendimento: [false],
      cursoId: [null, Validators.required],
      turmaId: [null, Validators.required],
      // Usa FormArray para lidar com múltiplos checkboxes
      diagnosticosId: this.fb.array([])
    });
  }

  carregarCombos(): void {
    this.cursoService.findAll().subscribe(data => this.cursos = data);
    this.turmaService.findAll().subscribe(data => this.turmas = data);
    this.diagnosticoService.findAll().subscribe(data => this.diagnosticos = data);
  }

  // --- FUNÇÃO PARA CARREGAR DADOS NO FORMULÁRIO ---
  carregarDadosAluno(id: number): void {
    this.alunoService.findById(id).subscribe({
        next: (aluno) => {
            // Preenche os campos simples
            this.form.patchValue({
                nome: aluno.nome,
                nomeSocial: aluno.nomeSocial,
                matricula: aluno.matricula,
                prioridadeAtendimento: aluno.prioridadeAtendimento,
                cursoId: aluno.curso?.id,
                turmaId: aluno.turma?.id
            });

            // Limpa e preenche os checkboxes de diagnóstico
            const diagnosticosFormArray = this.form.get('diagnosticosId') as FormArray;
            diagnosticosFormArray.clear(); // Limpa antes de preencher
            aluno.diagnosticos.forEach(diag => {
                diagnosticosFormArray.push(this.fb.control(diag.id));
            });
        },
        error: (err) => {
            console.error('Erro ao carregar aluno para edição:', err);
            alert('Aluno não encontrado!');
            this.router.navigate(['/alunos']); // Volta para a lista se der erro
        }
    });
  }

  // --- LÓGICA PARA CHECKBOXES DE DIAGNÓSTICO ---
  // Chamada quando um checkbox muda
  onDiagnosticoChange(evento: any): void {
    const diagnosticosFormArray = this.form.get('diagnosticosId') as FormArray;
    const idDiagnostico = +evento.target.value; // Pega o ID do checkbox

    if (evento.target.checked) {
      // Adiciona o ID ao FormArray se marcado
      diagnosticosFormArray.push(this.fb.control(idDiagnostico));
    } else {
      // Remove o ID do FormArray se desmarcado
      const indice = diagnosticosFormArray.controls.findIndex(ctrl => ctrl.value === idDiagnostico);
      if (indice >= 0) {
        diagnosticosFormArray.removeAt(indice);
      }
    }
  }

  // Usada no HTML para marcar os checkboxes corretos no modo edição
  diagnosticoSelecionado(idDiagnostico: number): boolean {
    const diagnosticosFormArray = this.form.get('diagnosticosId') as FormArray;
    return diagnosticosFormArray.value.includes(idDiagnostico);
  }
  // --- FIM DA LÓGICA DE DIAGNÓSTICOS ---

  // --- FUNÇÃO DE SUBMISSÃO (JÁ TINHAS ANTES, MAS VERIFICA) ---
  onSubmit(): void {
    if (this.form.invalid) {
      alert('Formulário inválido!');
      // Marca todos os campos como "tocados" para mostrar erros de validação
      this.form.markAllAsTouched();
      return;
    }

    const alunoDados = this.form.value;

    // Decide entre chamar update ou insert
    const operacao = this.isEdicao
      ? this.alunoService.update(this.alunoId!, alunoDados)
      : this.alunoService.insert(alunoDados);

    operacao.subscribe({
      next: () => {
        alert(`Aluno ${this.isEdicao ? 'atualizado' : 'cadastrado'}!`);
        this.router.navigate(['/alunos']);
      },
      error: (err) => {
        console.error('Erro ao salvar aluno:', err);
        // Tenta mostrar uma mensagem de erro mais específica da API, se disponível
        const mensagemErro = err.error?.message || err.message || 'Erro desconhecido ao salvar.';
        alert(`Erro: ${mensagemErro}`);
      }
    });
  }
}
