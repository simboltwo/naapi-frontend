import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Diagnostico } from '../models/diagnostico'; // Usa o modelo

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {
  private apiUrl = `${appSettings.apiBaseUrl}/diagnosticos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findAll(): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>(this.apiUrl, this.auth.getAuthHeaders());
  }
}
