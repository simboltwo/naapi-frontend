// src/app/pages/aluno-detalhe/aluno-detalhe.component.ts
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunoService } from '../../services/aluno';
import { AtendimentoService } from '../../services/atendimento';
import { Aluno } from '../../models/aluno';
import { Atendimento, AtendimentoInsert, TipoAtendimento, Usuario } from '../../models/atendimento';
import { TipoAtendimentoService } from '../../services/tipo-atendimento';
import { UsuarioService } from '../../services/usuario';
// --- IMPORTAÇÃO ADICIONADA ---
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { LaudoService } from '../../services/laudo';
import { Laudo, LaudoInsert } from '../../models/laudo';

@Component({
  selector: 'app-aluno-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ReactiveFormsModule],
  templateUrl: './aluno-detalhe.html',
  styleUrls: ['./aluno-detalhe.css']
})
export class AlunoDetalheComponent implements OnInit {

  alunoId!: number;
  activeTab: 'atendimentos' | 'laudos' = 'atendimentos';

  aluno: WritableSignal<Aluno | null> = signal(null);

  // Sinais de Atendimento
  atendimentos: WritableSignal<Atendimento[]> = signal([]);
  showModalAtendimento = signal(false);
  formAtendimento!: FormGroup;
  atendimentoEmEdicaoId: WritableSignal<number | null> = signal(null);

  // Sinais de Laudo
  private laudoFile: File | null = null;
  laudos: WritableSignal<Laudo[]> = signal([]);
  showModalLaudo = signal(false);
  formLaudo!: FormGroup;

  // Combos (compartilhados)
  tiposAtendimento: WritableSignal<TipoAtendimento[]> = signal([]);
  usuariosNaapi: WritableSignal<Usuario[]> = signal([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alunoService: AlunoService,
    private atendimentoService: AtendimentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private usuarioService: UsuarioService,
    private laudoService: LaudoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/alunos']);
      return;
    }
    this.alunoId = +idParam;

    this.carregarDadosAluno();
    this.carregarAtendimentos();
    this.carregarLaudos();

    this.inicializarFormAtendimento();
    this.inicializarFormLaudo();
  }

  carregarDadosAluno(): void {
    this.alunoService.findById(this.alunoId).subscribe({
      next: (data) => this.aluno.set(data),
      error: (err) => alert('Erro ao carregar dados do aluno.')
    });
  }

  // --- LÓGICA DE ATENDIMENTOS ---

  carregarAtendimentos(): void {
    this.atendimentoService.findByAlunoId(this.alunoId).subscribe({
      next: (data) => this.atendimentos.set(data),
      error: (err) => alert('Erro ao carregar histórico de atendimentos.')
    });
  }

  inicializarFormAtendimento(): void {
    this.formAtendimento = this.fb.group({
      dataHora: [this.getISODateTimeLocal(new Date()), Validators.required],
      tipoAtendimentoId: [null, Validators.required],
      responsavelId: [null, Validators.required],
      status: ['Realizado', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  abrirModalAtendimento(atendimento: Atendimento | null = null): void {
    if(this.tiposAtendimento().length === 0) {
      this.tipoAtendimentoService.findAll().subscribe(data => this.tiposAtendimento.set(data));
    }
    if(this.usuariosNaapi().length === 0) {
      this.usuarioService.findAll().subscribe(data => this.usuariosNaapi.set(data));
    }

    if (atendimento) {
      this.atendimentoEmEdicaoId.set(atendimento.id);
      this.formAtendimento.reset({
        dataHora: this.getISODateTimeLocal(new Date(atendimento.dataHora)),
        tipoAtendimentoId: atendimento.tipoAtendimentoId,
        responsavelId: atendimento.responsavelId,
        status: atendimento.status,
        descricao: atendimento.descricao
      });
    } else {
      this.atendimentoEmEdicaoId.set(null);
      this.formAtendimento.reset({
        dataHora: this.getISODateTimeLocal(new Date()),
        status: 'Realizado'
      });
    }

    this.showModalAtendimento.set(true);
  }

  fecharModalAtendimento(): void {
    this.showModalAtendimento.set(false);
  }

  salvarAtendimento(): void {
    if (this.formAtendimento.invalid) {
      this.formAtendimento.markAllAsTouched();
      return;
    }

    const payload: AtendimentoInsert = {
      ...this.formAtendimento.value,
      alunoId: this.alunoId
    };

    const idEdicao = this.atendimentoEmEdicaoId();

    if (idEdicao) {
      this.atendimentoService.update(idEdicao, payload).subscribe({
        next: (atendimentoAtualizado) => {
          this.atendimentos.update(lista =>
            lista.map(a => a.id === idEdicao ? atendimentoAtualizado : a)
          );
          this.fecharModalAtendimento();
        },
        error: (err) => alert('Erro ao atualizar atendimento.')
      });
    } else {
      this.atendimentoService.insert(payload).subscribe({
        next: (novoAtendimento) => {
          this.atendimentos.update(lista => [novoAtendimento, ...lista]);
          this.fecharModalAtendimento();
        },
        error: (err) => alert('Erro ao salvar atendimento.')
      });
    }
  }

  excluirAtendimento(id: number): void {
    if(confirm('Tem certeza que deseja excluir este registro de atendimento?')) {
      this.atendimentoService.delete(id).subscribe({
        next: () => {
          this.atendimentos.update(lista => lista.filter(a => a.id !== id));
        },
        error: (err) => alert('Erro ao excluir atendimento.')
      });
    }
  }

  // --- LÓGICA DE LAUDOS ---

  carregarLaudos(): void {
    this.laudoService.findByAlunoId(this.alunoId).subscribe({
      next: (data) => this.laudos.set(data),
      error: (err) => alert('Erro ao carregar laudos.')
    });
  }

  inicializarFormLaudo(): void {
    this.formLaudo = this.fb.group({
      dataEmissao: [new Date().toISOString().split('T')[0], Validators.required],
      urlArquivo: ['https://upload-nao-implementado.com', Validators.required], // Valor fake para validar
      descricao: [''],
    });
  }

  onLaudoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.laudoFile = input.files[0];

      if (this.laudoFile.type !== 'application/pdf') {
        alert('Erro: O arquivo deve ser um PDF.');
        input.value = '';
        this.laudoFile = null;
        return;
      }

      // Seta o nome do arquivo na descrição se estiver vazia
      if (!this.formLaudo.get('descricao')?.value) {
        this.formLaudo.get('descricao')?.setValue(this.laudoFile.name);
      }
    }
  }

  abrirModalLaudo(): void {
    this.formLaudo.reset({
      dataEmissao: new Date().toISOString().split('T')[0]
    });
    this.showModalLaudo.set(true);
  }

  fecharModalLaudo(): void {
    this.showModalLaudo.set(false);
  }

  salvarLaudo(): void {
    if (this.formLaudo.invalid) {
      this.formLaudo.markAllAsTouched();
      return;
    }

    // --- ALERTA DE BLOQUEIO (B4) ---
    if (this.laudoFile) {
      alert('Upload de Arquivo (Bloqueado): A API ainda não está pronta para receber arquivos. Esta funcionalidade precisa de atualização no backend (Java) para aceitar MultipartFile.');
       // Se o backend fosse atualizado, aqui chamaríamos o serviço de upload
       // e só depois o laudoService.insert() com a URL retornada.
      return;
    }

    // (A lógica abaixo só funcionará se o usuário colar uma URL manualmente)
    const payload: LaudoInsert = {
      ...this.formLaudo.value,
      alunoId: this.alunoId
    };

    this.laudoService.insert(payload).subscribe({
      next: (novoLaudo) => {
        this.laudos.update(lista => [novoLaudo, ...lista]);
        this.fecharModalLaudo();
        this.laudoFile = null; // Limpa o arquivo
      },
      error: (err) => alert('Erro ao salvar laudo. Verifique se a URL é válida.')
    });
  }

  excluirLaudo(id: number): void {
    if(confirm('Tem certeza que deseja excluir este laudo?')) {
      this.laudoService.delete(id).subscribe({
        next: () => {
          this.laudos.update(lista => lista.filter(l => l.id !== id));
        },
        error: (err) => alert('Erro ao excluir laudo.')
      });
    }
  }

  // --- Métodos Auxiliares ---

  mudarAbaPrincipal(aba: 'atendimentos' | 'laudos'): void {
    this.activeTab = aba;
  }

  private getISODateTimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  }

  getIniciais(nome: string | undefined): string {
      if (!nome) return '?';
      const partes = nome.split(' ');
      if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  // --- ADICIONADO: Helper para validação do form no HTML ---
  getControl(form: FormGroup, path: string): AbstractControl {
    const control = form.get(path);
    if (!control) {
      // Isso é um erro de programação, então é bom lançar um erro
      throw new Error(`Controle não encontrado no formulário: ${path}`);
    }
    return control;
  }

  excluirAluno(): void {
    const aluno = this.aluno();
    if (!aluno) return;

    const confirmacao = confirm(`Tem certeza que deseja excluir (inativar) o aluno ${aluno.nome}? Esta ação não pode ser desfeita.`);

    if (confirmacao) {
      this.alunoService.delete(aluno.id).subscribe({
        next: () => {
          alert('Aluno inativado com sucesso.');
          this.router.navigate(['/alunos']); // Volta para o painel
        },
        error: (err) => {
          console.error('Erro ao excluir aluno:', err);
          alert('Erro ao excluir aluno. Tente novamente.');
        }
      });
    }
  }
}
