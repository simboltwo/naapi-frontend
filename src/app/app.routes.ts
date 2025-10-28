// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; // Renomear classe no ficheiro login.ts
import { AlunoList } from './pages/aluno-list/aluno-list'; // Renomear classe no ficheiro aluno-list.ts
import { AlunoForm } from './pages/aluno-form/aluno-form'; // Renomear classe no ficheiro aluno-form.ts
import { CursoList } from './pages/curso-list/curso-list'; // Importa o novo
import { CursoForm } from './pages/curso-form/curso-form'; // Importa o novo

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },

    { path: 'alunos', component: AlunoList },
    { path: 'alunos/novo', component: AlunoForm },
    { path: 'alunos/:id', component: AlunoForm },

    // --- NOVAS ROTAS PARA CURSOS ---
    { path: 'cursos', component: CursoList },
    { path: 'cursos/novo', component: CursoForm},
    { path: 'cursos/:id', component: CursoForm },
    // --- FIM DAS NOVAS ROTAS ---

    { path: '**', redirectTo: 'login' }
];
