// src/app/pages/login/login.ts (CORRIGIDO)

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  loginError: string | null = null; // <<< --- ADICIONE ESTA LINHA --- <<<

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.loginError = null; // <<< --- Limpa erro anterior ao tentar logar --- <<<
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (username === this.authService.USERNAME && password === this.authService.PASSWORD) {
        console.log('Login SUCESSO. Redirecionando...');
        this.router.navigate(['/alunos']);
      } else {
        // Define a mensagem de erro em vez de usar alert()
        this.loginError = 'Credenciais inválidas! Verifique seu email e senha.'; // <<< --- ATRIBUI O ERRO AQUI --- <<<
        console.error('Tentativa de login falhou.'); // Log para debug
      }
    } else {
       // Opcional: Se quiser uma mensagem genérica se o form for inválido
       this.loginError = 'Por favor, preencha todos os campos.';
    }
  }
}
