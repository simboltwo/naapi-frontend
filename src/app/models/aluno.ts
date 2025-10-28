// src/app/models/aluno.ts

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

// Modelo principal (DTO) Aluno
export class Aluno {
    id!: number;
    nome!: string;
    nomeSocial?: string;
    matricula!: string;
    foto?: string;
    prioridadeAtendimento!: boolean;
    ativo!: boolean;

    // Relacionamentos (Usamos os DTOs)
    curso?: CursoDTO;
    turma?: TurmaDTO;
    diagnosticos!: DiagnosticoDTO[];
}
