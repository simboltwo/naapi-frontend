// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AlunoList } from './pages/aluno-list/aluno-list';
import { AlunoForm } from './pages/aluno-form/aluno-form';

// --- IMPORTAÇÃO DO NOVO COMPONENTE ---
import { AlunoDetalheComponent } from './pages/aluno-detalhe/aluno-detalhe';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },

    // Rotas de Aluno
    { path: 'alunos', component: AlunoList }, // O novo "Painel de Cards"
    { path: 'alunos/novo', component: AlunoForm }, // Formulário de criação
    { path: 'alunos/editar/:id', component: AlunoForm }, // Formulário de edição

    // --- NOVA ROTA: O "HUB" DO ALUNO ---
    // É aqui que veremos os detalhes e o histórico de atendimentos
    { path: 'alunos/detalhe/:id', component: AlunoDetalheComponent },

    // --- Rotas de Curso REMOVIDAS ---

    { path: '**', redirectTo: 'login' }
];
