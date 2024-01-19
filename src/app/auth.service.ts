import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://synverse.qubeapi.com/api';
  private loginUrl = 'https://synverse.qubeapi.com/api';
  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem('refreshToken', token);
  }

  removeToken(): void {
    sessionStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  refreshToken(): Observable<string> {
    const refreshToken = sessionStorage.getItem('refreshToken');

    // Make a request to your server to refresh the token
    return this.http.post<string>(`${this.apiUrl}/refresh-token`, {
      refreshToken,
    });
  }

  login(): Observable<any> {
    const credentials = {
      domain: 'synverse',
      email: 'synverse@yopmail.com',
      password: 'xmYZEYzxOuX',
    };
    return this.http.post<any>(`${this.loginUrl}/login`, credentials);
  }

  logout(): void {
    // Perform any additional logout logic
    this.removeToken();
  }
}
