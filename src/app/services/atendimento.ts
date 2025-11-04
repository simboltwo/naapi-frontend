// src/app/services/atendimento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Atendimento, AtendimentoInsert } from '../models/atendimento';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private apiUrl = `${appSettings.apiBaseUrl}/atendimentos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findByAlunoId(alunoId: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/aluno/${alunoId}`, this.auth.getAuthHeaders());
  }

  insert(atendimento: AtendimentoInsert): Observable<Atendimento> {
    return this.http.post<Atendimento>(this.apiUrl, atendimento, this.auth.getAuthHeaders());
  }

  // --- NOVO MÉTODO ---
  // PUT /atendimentos/{id}
  update(id: number, atendimento: AtendimentoInsert): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.apiUrl}/${id}`, atendimento, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }
}
