// src/app/services/tipo-atendimento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { TipoAtendimento } from '../models/atendimento'; // Reutiliza o modelo

@Injectable({ providedIn: 'root' })
export class TipoAtendimentoService {
  private apiUrl = `${appSettings.apiBaseUrl}/tipos-atendimento`;

  constructor(private http: HttpClient, private auth: Auth) { }

  // GET /tipos-atendimento
  findAll(): Observable<TipoAtendimento[]> {
    return this.http.get<TipoAtendimento[]>(this.apiUrl, this.auth.getAuthHeaders());
  }
}
