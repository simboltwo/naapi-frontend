// src/app/services/laudo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Laudo, LaudoInsert } from '../models/laudo';
@Injectable({ providedIn: 'root' })
export class LaudoService {
  private apiUrl = `${appSettings.apiBaseUrl}/laudos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findByAlunoId(alunoId: number): Observable<Laudo[]> {
    return this.http.get<Laudo[]>(`${this.apiUrl}/aluno/${alunoId}`, this.auth.getAuthHeaders());
  }

  insert(laudoDto: LaudoInsert, file: File): Observable<Laudo> {

    const formData = new FormData();

    formData.append('alunoId', laudoDto.alunoId.toString());
    formData.append('dataEmissao', laudoDto.dataEmissao || '');
    formData.append('descricao', laudoDto.descricao || '');

    formData.append('file', file, file.name);

    return this.http.post<Laudo>(this.apiUrl, formData, this.auth.getAuthHeaders(true));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }
}
