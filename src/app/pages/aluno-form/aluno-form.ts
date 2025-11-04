// src/app/pages/aluno-form/aluno-form.ts
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { CursoService } from '../../services/curso';
import { TurmaService, Turma } from '../../services/turma';
import { DiagnosticoService } from '../../services/diagnostico';
import { Aluno, ResponsavelDTO } from '../../models/aluno'; // ResponsavelDTO importado
import { Curso } from '../../models/curso';
import { Diagnostico } from '../../models/diagnostico';
import { AlunoInsert, ResponsavelInsert } from '../../models/aluno-insert';
import { TipoAtendimentoService } from '../../services/tipo-atendimento';
import { UsuarioService } from '../../services/usuario';
import { TipoAtendimento, Usuario } from '../../models/atendimento';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './aluno-form.html',
  styleUrls: ['./aluno-form.css'],
})
export class AlunoForm implements OnInit {

  form!: FormGroup;
  alunoId: number | null = null;
  isEdicao: boolean = false;
  activeTab: 'pessoal' | 'academico' | 'naapi' = 'pessoal';

  // Arrays de dados
  cursos: Curso[] = [];
  turmas: Turma[] = [];
  diagnosticos: Diagnostico[] = [];
  tiposAtendimento: WritableSignal<TipoAtendimento[]> = signal([]);
  usuariosNaapi: WritableSignal<Usuario[]> = signal([]);

  // Sinais de Filtro
  filtroCurso: WritableSignal<string> = signal('');
  filtroTurma: WritableSignal<string> = signal('');
  cursosFiltrados: WritableSignal<Curso[]> = signal([]);
  turmasFiltradas: WritableSignal<Turma[]> = signal([]);
  filtroTipoAtendimento: WritableSignal<string> = signal('');
  filtroAssistente: WritableSignal<string> = signal('');
  filtroMembro: WritableSignal<string> = signal('');
  tiposAtendimentoFiltrados: WritableSignal<TipoAtendimento[]> = signal([]);
  assistentesFiltrados: WritableSignal<Usuario[]> = signal([]);
  membrosFiltrados: WritableSignal<Usuario[]> = signal([]);

  // Sinais de Upload
  previewFoto: WritableSignal<string | null> = signal(null);
  fotoArquivo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private cursoService: CursoService,
    private turmaService: TurmaService,
    private diagnosticoService: DiagnosticoService,
    private router: Router,
    private route: ActivatedRoute,
    private tipoAtendimentoService: TipoAtendimentoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCombos();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.alunoId = +idParam;
      this.isEdicao = true;
      this.carregarDadosAluno(this.alunoId);
    }
  }

  // --- ATUALIZADO: Usando FormArray para 'responsaveis' ---
  inicializarFormulario(): void {
    this.form = this.fb.group({
      pessoal: this.fb.group({
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        nomeSocial: ['', [Validators.maxLength(100)]],
        cpf: ['', [Validators.maxLength(20)]],
        dataNascimento: [null],
        telefoneEstudante: ['', [Validators.maxLength(20)]],
        foto: [null], // Campo 'foto' é para o patchValue, não será enviado

        // --- CORREÇÃO: 'responsaveis' é um FormArray ---
        responsaveis: this.fb.array([])
      }),
      academico: this.fb.group({
        matricula: ['', [Validators.required, Validators.maxLength(20)]],
        cursoId: [null, Validators.required],
        turmaId: [null, Validators.required],
        serie: ['', [Validators.maxLength(10)]],
      }),
      naapi: this.fb.group({
        prioridade: ['Baixa', Validators.required],
        processoSipac: ['', [Validators.maxLength(30)]],
        provaOutroEspaco: [false],
        possuiPEI: [false],
        diagnosticosId: this.fb.array([]),
        tipoAtendimentoPrincipalId: [null],
        assistenteReferenciaId: [null],
        membroNaapiReferenciaId: [null],
        dataUltimoLaudo: [null],
        adaptacoesNecessarias: [''],
        anotacoesNaapi: [''],
        necessidadesRelatoriosMedicos: [''],
      })
    });
  }

  // --- Helpers para o FormArray de Responsáveis ---

  // Getter para o FormArray
  get responsaveisArray() {
    return this.pessoalForm.get('responsaveis') as FormArray;
  }

  // --- NOVO (Correção Erro 3): Getter para o template HTML ---
  get responsaveisControls() {
    return this.responsaveisArray.controls as FormGroup[];
  }

  // Cria um novo grupo de responsável (para adicionar ou carregar)
  novoResponsavel(resp: ResponsavelDTO | ResponsavelInsert | null = null): FormGroup {
    return this.fb.group({
      nome: [resp?.nome || '', Validators.required],
      parentesco: [resp?.parentesco || 'Outro'],
      telefone: [resp?.telefone || ''],
      autorizadoBuscar: [resp?.autorizadoBuscar || false]
    });
  }

  adicionarResponsavel(): void {
    this.responsaveisArray.push(this.novoResponsavel());
  }

  removerResponsavel(index: number): void {
    this.responsaveisArray.removeAt(index);
  }
  // --- Fim dos Helpers ---


  get pessoalForm() { return this.form.get('pessoal') as FormGroup; }
  get academicoForm() { return this.form.get('academico') as FormGroup; }
  get naapiForm() { return this.form.get('naapi') as FormGroup; }

  carregarCombos(): void {
    this.cursoService.findAll().subscribe(data => {
      this.cursos = data;
      this.cursosFiltrados.set(data);
    });
    this.turmaService.findAll().subscribe(data => {
      this.turmas = data;
      this.turmasFiltradas.set(data);
    });
    this.diagnosticoService.findAll().subscribe(data => this.diagnosticos = data);

    this.tipoAtendimentoService.findAll().subscribe(data => {
      this.tiposAtendimento.set(data);
      this.tiposAtendimentoFiltrados.set(data);
    });
    this.usuarioService.findAll().subscribe(data => {
      this.usuariosNaapi.set(data);
      this.assistentesFiltrados.set(data);
      this.membrosFiltrados.set(data);
    });
  }

  // --- ATUALIZADO: Popula o FormArray de Responsáveis ---
  carregarDadosAluno(id: number): void {
    this.alunoService.findById(id).subscribe({
        next: (aluno) => {
            this.form.patchValue({
              pessoal: {
                nome: aluno.nome,
                nomeSocial: aluno.nomeSocial,
                cpf: aluno.cpf,
                dataNascimento: aluno.dataNascimento,
                telefoneEstudante: aluno.telefoneEstudante,
                foto: aluno.foto
              },
              academico: {
                matricula: aluno.matricula,
                cursoId: aluno.curso?.id,
                turmaId: aluno.turma?.id,
                serie: aluno.serie,
              },
              naapi: {
                prioridade: aluno.prioridade,
                processoSipac: aluno.processoSipac,
                provaOutroEspaco: aluno.provaOutroEspaco,
                possuiPEI: aluno.possuiPEI,
                tipoAtendimentoPrincipalId: this.findIdByNome(this.tiposAtendimento(), aluno.tipoAtendimentoPrincipal),
                assistenteReferenciaId: this.findIdByNome(this.usuariosNaapi(), aluno.assistenteReferencia),
                membroNaapiReferenciaId: this.findIdByNome(this.usuariosNaapi(), aluno.membroNaapiReferencia),
                dataUltimoLaudo: aluno.dataUltimoLaudo,
                adaptacoesNecessarias: aluno.adaptacoesNecessarias,
                anotacoesNaapi: aluno.anotacoesNaapi,
                necessidadesRelatoriosMedicos: aluno.necessidadesRelatoriosMedicos
              }
            });

            // Popula foto
            if (aluno.foto) {
              this.previewFoto.set(aluno.foto);
            }

            // Popula Diagnósticos
            const diagnosticosFormArray = this.naapiForm.get('diagnosticosId') as FormArray;
            diagnosticosFormArray.clear();
            aluno.diagnosticos.forEach(diag => {
                diagnosticosFormArray.push(this.fb.control(diag.id));
            });

            // Popula Responsáveis
            this.responsaveisArray.clear();
            if (aluno.responsaveis) {
              aluno.responsaveis.forEach(resp => {
                this.responsaveisArray.push(this.novoResponsavel(resp));
              });
            }
        },
        error: (err) => this.handleApiError(err, 'carregar')
    });
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB (aumentamos o limite)
        alert('Erro: A imagem é muito grande. (Máx 10MB)');
        input.value = '';
        return;
      }
      this.fotoArquivo = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewFoto.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onDiagnosticoChange(evento: any): void {
    const diagnosticosFormArray = this.naapiForm.get('diagnosticosId') as FormArray;
    const idDiagnostico = +evento.target.value;
    if (evento.target.checked) {
      diagnosticosFormArray.push(this.fb.control(idDiagnostico));
    } else {
      const indice = diagnosticosFormArray.controls.findIndex(ctrl => ctrl.value === idDiagnostico);
      if (indice >= 0) {
        diagnosticosFormArray.removeAt(indice);
      }
    }
  }

  diagnosticoSelecionado(idDiagnostico: number): boolean {
    const diagnosticosFormArray = this.naapiForm.get('diagnosticosId') as FormArray;
    return diagnosticosFormArray.value.includes(idDiagnostico);
  }

  mudarAba(aba: 'pessoal' | 'academico' | 'naapi'): void {
    if (aba === 'academico') {
      this.pessoalForm.markAllAsTouched();
      if (this.pessoalForm.invalid) return;
    }
    if (aba === 'naapi') {
      this.pessoalForm.markAllAsTouched();
      this.academicoForm.markAllAsTouched();
      if (this.pessoalForm.invalid || this.academicoForm.invalid) return;
    }
    this.activeTab = aba;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Formulário inválido! Verifique os campos obrigatórios em todas as abas.');
      this.form.markAllAsTouched();
      this.focarNaAbaComErro();
      return;
    }

    // Pega os dados brutos dos sub-formulários
    const pessoalData = this.pessoalForm.getRawValue();
    const academicoData = this.academicoForm.getRawValue();
    const naapiData = this.naapiForm.getRawValue();

    // Combina os dados no formato do AlunoInsertDTO
    const alunoDados: AlunoInsert = {
      // Pessoal
      nome: pessoalData.nome,
      nomeSocial: pessoalData.nomeSocial,
      cpf: pessoalData.cpf,
      dataNascimento: pessoalData.dataNascimento,
      telefoneEstudante: pessoalData.telefoneEstudante,
      responsaveis: pessoalData.responsaveis, // Envia o array de responsáveis

      // Acadêmico
      matricula: academicoData.matricula,
      cursoId: academicoData.cursoId,
      turmaId: academicoData.turmaId,
      serie: academicoData.serie,

      // NAAPI (spread operator)
      ...naapiData
    };

    // O campo 'foto' (arquivo) é enviado separadamente
    const operacao = this.isEdicao
      ? this.alunoService.update(this.alunoId!, alunoDados, this.fotoArquivo)
      : this.alunoService.insert(alunoDados, this.fotoArquivo);

    operacao.subscribe({
      next: (alunoSalvo) => {
        alert(`Aluno ${this.isEdicao ? 'atualizado' : 'cadastrado'}!`);
        this.fotoArquivo = null;
        this.router.navigate(['/alunos/detalhe', alunoSalvo.id]);
      },
      error: (err) => this.handleApiError(err, 'salvar')
    });
  }

  private handleApiError(err: any, acao: string): void {
      console.error(`Erro ao ${acao}:`, err);
      let mensagemErro = `Ocorreu um erro ao ${acao}.`;

      if (err.status === 422 && err.error?.message) {
         mensagemErro = err.error.message;
      } else if (err.error?.message) {
        mensagemErro = err.error.message;
      }

      alert(mensagemErro);
      this.focarNaAbaComErro();
  }

  private focarNaAbaComErro(): void {
      if (this.pessoalForm.invalid) {
        this.activeTab = 'pessoal';
        return;
      }
      if (this.academicoForm.invalid) {
        this.activeTab = 'academico';
        return;
      }
      if (this.naapiForm.invalid) {
         this.activeTab = 'naapi';
      }
  }

  // Helper para encontrar ID pelo nome no combo
  private findIdByNome(lista: any[], nome: string | undefined): number | null {
    if (!nome) return null;
    const item = lista.find(i => i.nome === nome);
    return item ? item.id : null;
  }

  // --- Filtros de Selects ---
  onFiltroCursoChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroCurso.set(valor);
    this.cursosFiltrados.set(
      this.cursos.filter(c => c.nome.toLowerCase().includes(valor))
    );
  }
  onFiltroTurmaChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroTurma.set(valor);
    this.turmasFiltradas.set(
      this.turmas.filter(t => t.nome.toLowerCase().includes(valor))
    );
  }
  onFiltroTipoAtendimentoChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroTipoAtendimento.set(valor);
    this.tiposAtendimentoFiltrados.set(
      this.tiposAtendimento().filter(t => t.nome.toLowerCase().includes(valor))
    );
  }
  onFiltroAssistenteChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroAssistente.set(valor);
    this.assistentesFiltrados.set(
      this.usuariosNaapi().filter(u => u.nome.toLowerCase().includes(valor))
    );
  }
  onFiltroMembroChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroMembro.set(valor);
    this.membrosFiltrados.set(
      this.usuariosNaapi().filter(u => u.nome.toLowerCase().includes(valor))
    );
  }

  resetarFiltrosSelect(): void {
    if (this.filtroCurso() !== '') {
      this.filtroCurso.set('');
      this.cursosFiltrados.set(this.cursos);
    }
     if (this.filtroTurma() !== '') {
      this.filtroTurma.set('');
      this.turmasFiltradas.set(this.turmas);
    }
    if (this.filtroTipoAtendimento() !== '') {
      this.filtroTipoAtendimento.set('');
      this.tiposAtendimentoFiltrados.set(this.tiposAtendimento());
    }
    if (this.filtroAssistente() !== '') {
      this.filtroAssistente.set('');
      this.assistentesFiltrados.set(this.usuariosNaapi());
    }
    if (this.filtroMembro() !== '') {
      this.filtroMembro.set('');
      this.membrosFiltrados.set(this.usuariosNaapi());
    }
  }

  // Helper para o template (necessário para validação)
  getControl(form: FormGroup | AbstractControl, path: string): AbstractControl {
    const control = form.get(path);
    if (!control) {
      throw new Error(`Controle não encontrado: ${path}`);
    }
    return control; // Retorna como AbstractControl
  }
}
