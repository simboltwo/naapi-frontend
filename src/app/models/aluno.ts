// src/app/models/aluno.ts

// DTOs aninhados
export class CursoDTO {
    id!: number;
    nome!: string;
}
export class TurmaDTO {
    id!: number;
    nome!: string;
}
export class DiagnosticoDTO {
    id!: number;
    nome!: string;
    cid?: string;
    sigla?: string;
}

// Modelo para o DTO de Responsável (de leitura)
export class ResponsavelDTO {
    id!: number;
    nome!: string;
    parentesco?: string;
    telefone?: string;
    autorizadoBuscar?: boolean;
}
// Modelo principal (DTO) Aluno - Mapeado do AlunoDTO.java
export class Aluno {
    id!: number;
    nome!: string;
    nomeSocial?: string;
    matricula!: string;
    cpf?: string;
    dataNascimento?: string;
    serie?: string;
    foto?: string;
    prioridade?: string;
    nomeProtegido?: string;
    provaOutroEspaco?: boolean;
    adaptacoesNecessarias?: string;
    possuiPEI?: boolean;
    telefoneEstudante?: string;

    tipoAtendimentoPrincipal?: string;
    assistenteReferencia?: string;
    membroNaapiReferencia?: string;

    processoSipac?: string;
    anotacoesNaapi?: string;
    necessidadesRelatoriosMedicos?: string;
    dataUltimoLaudo?: string;
    ativo!: boolean;

    // Relacionamentos
    curso?: CursoDTO;
    turma?: TurmaDTO;
    diagnosticos!: DiagnosticoDTO[];

    // --- CORREÇÃO: Adicionar a lista de responsáveis ---
    responsaveis!: ResponsavelDTO[];
}
