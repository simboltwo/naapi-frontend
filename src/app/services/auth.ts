// src/app/services/auth.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { appSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  public readonly USERNAME = 'admin@naapi.com'; // Use seu usuário
  public readonly PASSWORD = '123456'; // Use sua senha

  constructor() { }

  // --- MÉTODO ATUALIZADO ---
  // Adicionamos um parâmetro opcional 'isMultipart'
  getAuthHeaders(isMultipart: boolean = false): { headers: HttpHeaders } {

    const credentials = btoa(`${this.USERNAME}:${this.PASSWORD}`);
    let headers: HttpHeaders;

    if (isMultipart) {
      // Para multipart (uploads), NUNCA definimos o Content-Type.
      // O navegador faz isso sozinho e adiciona o 'boundary' correto.
      headers = new HttpHeaders({
        'Authorization': `Basic ${credentials}`
      });
    } else {
      // Para JSON padrão
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      });
    }

    return { headers: headers };
  }
}
