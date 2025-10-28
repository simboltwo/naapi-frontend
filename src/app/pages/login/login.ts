// src/app/pages/login/login.ts (Implementação)

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Para redirecionar após o login
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Formulários Reativos
import { Auth } from '../../services/auth'; // O teu serviço de Auth

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importa módulos de formulário
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit { // Adicionar OnInit

  loginForm!: FormGroup;

  // Injetar FormBuilder e Auth Service
  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Usamos 'admin@naapi.com' e '123456' como padrão para Basic Auth
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Nota: No Basic Auth, a autenticação é feita em CADA pedido.
      // Aqui, vamos apenas verificar se as credenciais são as do nosso Admin.
      // Se fosse JWT (como noutros guias), faríamos um POST /auth.
      const { username, password } = this.loginForm.value;

      if (username === this.authService.USERNAME && password === this.authService.PASSWORD) {
        // Se as credenciais estiverem corretas, redireciona para a lista de alunos
        console.log('Login SUCESSO. Redirecionando...');
        this.router.navigate(['/alunos']);
      } else {
        alert('Credenciais inválidas! Tente admin@naapi.com / 123456');
      }
    }
  }
}
