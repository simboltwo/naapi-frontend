import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';

// Modelo simples para Turma (podes criar em models/turma.ts se preferir)
export class Turma {
  id!: number;
  nome!: string;
}

@Injectable({ providedIn: 'root' })
export class TurmaService {
  private apiUrl = `${appSettings.apiBaseUrl}/turmas`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findAll(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.apiUrl, this.auth.getAuthHeaders());
  }
}
