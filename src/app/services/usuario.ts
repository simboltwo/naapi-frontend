import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Usuario {
  id!: number;
  nome!: string;
  email!: string;
  papeis!: { id: number, authority: string }[];
}
