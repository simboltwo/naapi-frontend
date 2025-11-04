// src/app/services/laudo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Laudo, LaudoInsert } from '../models/laudo';

@Injectable({ providedIn: 'root' })
export class LaudoService {
  // Baseado no LaudoController.java
  private apiUrl = `${appSettings.apiBaseUrl}/laudos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  // GET /laudos/aluno/{alunoId}
  findByAlunoId(alunoId: number): Observable<Laudo[]> {
    return this.http.get<Laudo[]>(`${this.apiUrl}/aluno/${alunoId}`, this.auth.getAuthHeaders());
  }

  // POST /laudos
  insert(laudo: LaudoInsert): Observable<Laudo> {
    return this.http.post<Laudo>(this.apiUrl, laudo, this.auth.getAuthHeaders());
  }

  // DELETE /laudos/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }
}
