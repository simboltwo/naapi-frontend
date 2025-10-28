// src/app/services/aluno.ts (CORRIGIDO)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno'; // <-- ESTE É O MODEL
import { appSettings } from '../app.settings';
import { Auth } from './auth'; // <-- O Auth Service

@Injectable({
  providedIn: 'root'
})
// RENOMEAMOS ESTA CLASSE PARA AlunoService para evitar conflito com o Model Aluno
export class AlunoService {

  private apiUrl = `${appSettings.apiBaseUrl}/alunos`;

  // Injetamos o HttpClient e o Auth Service
  constructor(private http: HttpClient, private auth: Auth) { }

  // Função para listar todos os alunos
  findAll(): Observable<Aluno[]> { // Usa o Model Aluno aqui
    return this.http.get<Aluno[]>(this.apiUrl, this.auth.getAuthHeaders());
  }

  // (A função insert do plano anterior)
  insert(aluno: Aluno): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, aluno, this.auth.getAuthHeaders());
  }
}
