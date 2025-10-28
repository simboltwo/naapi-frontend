// src/app/services/aluno.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno'; // <-- Importa o modelo da pasta models
import { appSettings } from '../app.settings';
import { Auth } from './auth'; // Service de autenticação

@Injectable({
  providedIn: 'root'
})
// Esta classe é o Service e chama-se AlunoService
export class AlunoService {

    private apiUrl = `${appSettings.apiBaseUrl}/alunos`;

    constructor(private http: HttpClient, private auth: Auth) { }

    findAll(): Observable<Aluno[]> {
        return this.http.get<Aluno[]>(this.apiUrl, this.auth.getAuthHeaders());
    }

    insert(aluno: Aluno): Observable<Aluno> {
        return this.http.post<Aluno>(this.apiUrl, aluno, this.auth.getAuthHeaders());
    }
}
