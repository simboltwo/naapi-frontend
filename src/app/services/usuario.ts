// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Usuario } from '../models/atendimento'; // Reutiliza o modelo

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${appSettings.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient, private auth: Auth) { }

  // GET /usuarios (para preencher o combo de responsáveis)
  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, this.auth.getAuthHeaders());
  }
}
