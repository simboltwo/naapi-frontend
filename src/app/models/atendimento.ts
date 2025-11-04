// src/app/models/atendimento.ts

// DTO para listar
export class Atendimento {
  id!: number;
  dataHora!: string; // Vem como string ISO
  descricao!: string;
  status!: string;
  alunoId!: number;
  alunoNome!: string;
  responsavelId!: number;
  responsavelNome!: string;
  tipoAtendimentoId!: number;
  tipoAtendimentoNome!: string;
}

// DTO para inserir (payload)
export class AtendimentoInsert {
  dataHora!: string;
  descricao!: string;
  status!: string;
  alunoId!: number;
  responsavelId!: number;
  tipoAtendimentoId!: number;
}

// Modelo para o combo
export class TipoAtendimento {
  id!: number;
  nome!: string;
}

// Modelo para o combo
export class Usuario {
  id!: number;
  nome!: string;
  email!: string;
  // papeis não são necessários para o form
}
