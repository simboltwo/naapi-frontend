// src/app/services/aluno.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno'; // Model (dados)
import { appSettings } from '../app.settings';
import { Auth } from './auth'; // Service de autenticação

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiUrl = `${appSettings.apiBaseUrl}/alunos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  // Método que já tinhas:
  findAll(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl, this.auth.getAuthHeaders());
  }

  // --- NOVOS MÉTODOS ---

  findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }

  insert(aluno: Aluno): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, aluno, this.auth.getAuthHeaders());
  }

  update(id: number, aluno: Aluno): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, aluno, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }
}
