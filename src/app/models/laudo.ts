// src/app/models/laudo.ts

// DTO para listar (LaudoDTO.java)
export class Laudo {
    id!: number;
    dataEmissao!: string;
    urlArquivo!: string;
    descricao?: string;
    alunoId!: number;
}

// DTO para inserir (LaudoInsertDTO.java)
export class LaudoInsert {
    dataEmissao?: string;
    urlArquivo!: string;
    descricao?: string;
    alunoId!: number;
}
