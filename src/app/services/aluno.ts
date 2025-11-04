// src/app/services/aluno.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { AlunoInsert } from '../models/aluno-insert';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = `${appSettings.apiBaseUrl}/alunos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findAll(filtros?: { nome?: string, matricula?: string }): Observable<Aluno[]> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nome) {
        params = params.set('nome', filtros.nome);
      }
      if (filtros.matricula) {
        params = params.set('matricula', filtros.matricula);
      }
    }

    // Passa 'false' (ou nada) porque esta é uma requisição JSON
    const options = {
      ...this.auth.getAuthHeaders(false),
      params: params
    };

    return this.http.get<Aluno[]>(this.apiUrl, options);
  }

  findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders(false));
  }

  // --- ATUALIZADO (Upload de Arquivo) ---
  insert(aluno: AlunoInsert, foto: File | null): Observable<Aluno> {
    // 1. Criar o FormData
    const formData = new FormData();

    // 2. Adicionar o JSON como um Blob (texto)
    // Isso corresponde ao @RequestPart("aluno") String alunoJson
    formData.append('aluno', new Blob([JSON.stringify(aluno)], {
      type: 'application/json'
    }));

    // 3. Adicionar a foto (arquivo), se ela existir
    // Isso corresponde ao @RequestPart("foto") MultipartFile foto
    if (foto) {
      formData.append('foto', foto, foto.name);
    }

    // 4. Enviar. Passa 'true' para o getAuthHeaders
    return this.http.post<Aluno>(this.apiUrl, formData, this.auth.getAuthHeaders(true));
  }

  // --- ATUALIZADO (Upload de Arquivo) ---
  update(id: number, aluno: AlunoInsert, foto: File | null): Observable<Aluno> {
    const formData = new FormData();

    formData.append('aluno', new Blob([JSON.stringify(aluno)], {
      type: 'application/json'
    }));

    if (foto) {
      formData.append('foto', foto, foto.name);
    }

    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, formData, this.auth.getAuthHeaders(true));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders(false));
  }
}
