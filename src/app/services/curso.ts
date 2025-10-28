import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.settings';
import { Auth } from './auth';
import { Curso } from '../models/curso';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private apiUrl = `${appSettings.apiBaseUrl}/cursos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl, this.auth.getAuthHeaders());
  }

  // --- NOVOS MÉTODOS ---
  findById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }

  insert(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso, this.auth.getAuthHeaders());
  }

  update(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id}`, curso, this.auth.getAuthHeaders());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.auth.getAuthHeaders());
  }
}
