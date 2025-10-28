// src/app/services/auth.ts (CORRIGIDO)

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// REMOVE: import { environment } from '../../environments/environment'; // Esta linha deve ser removida
// ADICIONA:
import { appSettings } from '../app.settings'; // <-- Usa a tua própria configuração

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Define as credenciais aqui. Usamos os valores fixos do Admin que criaste.
  public readonly USERNAME = 'admin@naapi.com';
  public readonly PASSWORD = '123456';

  constructor() { }

  getAuthHeaders(): { headers: HttpHeaders } {
    // Não precisamos de usar a URL da API aqui, apenas as credenciais.
    const credentials = btoa(`${this.USERNAME}:${this.PASSWORD}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    });
    return { headers: headers };
  }
}
