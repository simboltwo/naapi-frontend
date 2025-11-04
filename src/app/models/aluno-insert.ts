// src/app/models/aluno-insert.ts

// Modelo para o DTO de Responsável (de escrita)
export class ResponsavelInsert {
  nome!: string;
  parentesco?: string;
  telefone?: string;
  autorizadoBuscar?: boolean;
}

// Modelo principal (AlunoInsertDTO.java)
export class AlunoInsert {
  nome!: string;
  nomeSocial?: string;
  matricula!: string;
  cpf?: string;
  dataNascimento?: string;
  serie?: string;
  // 'foto' não está aqui porque é enviado como um File separado
  prioridade?: string;
  provaOutroEspaco?: boolean;
  adaptacoesNecessarias?: string;
  possuiPEI?: boolean;
  telefoneEstudante?: string;

  processoSipac?: string;
  anotacoesNaapi?: string;
  necessidadesRelatoriosMedicos?: string;
  dataUltimoLaudo?: string;
  cursoId!: number;
  turmaId!: number;
  diagnosticosId?: number[];

  // --- CORRIGIDO: Este é o campo que a API espera ---
  responsaveis?: ResponsavelInsert[];

  tipoAtendimentoPrincipalId?: number;
  assistenteReferenciaId?: number;
  membroNaapiReferenciaId?: number;
}
