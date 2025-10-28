import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly USERNAME = 'admin@naapi.com';
  private readonly PASSWORD = '123456';

  constructor() { }

  getAuthHeaders(): { headers: HttpHeaders } {
    const credentials = btoa(`${this.USERNAME}:${this.PASSWORD}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    });
    return { headers: headers };
  }
}
