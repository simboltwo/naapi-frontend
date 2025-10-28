// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; // Renomear 'Login' para 'LoginComponent' é uma boa prática
import { AlunoList } from './pages/aluno-list/aluno-list'; // Renomear 'AlunoList' para 'AlunoListComponent'
import { AlunoForm } from './pages/aluno-form/aluno-form';

export const routes: Routes = [
    // Rota inicial - Redireciona para Login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Rota de Login
    { path: 'login', component: Login },

    // Rotas de Alunos (Área Protegida)
    { path: 'alunos', component: AlunoList }, // Lista de alunos
    { path: 'alunos/novo', component: AlunoForm }, // Formulário para novo aluno
    { path: 'alunos/:id', component: AlunoForm }, // Formulário para editar aluno

    // Catch-all (opcional, redireciona para login)
    { path: '**', redirectTo: 'login' }
];
