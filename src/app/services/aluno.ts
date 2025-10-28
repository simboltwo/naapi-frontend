import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';
import { appSettings } from '../app.settings';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class Aluno {
  id!: number;
  nome!: string;
  matricula!: string;
  private apiUrl = `${appSettings.apiBaseUrl}/alunos`;

  constructor(private http: HttpClient, private auth: Auth) { }

  findAll(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl, this.auth.getAuthHeaders());
  }
}
