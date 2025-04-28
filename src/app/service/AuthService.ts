import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenObject } from "../interface/TokenObject";
import { catchError, tap, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {

  private readonly apiUrl = "http://localhost:8080";
  private readonly tokenKey = 'auth_token';

  constructor(private readonly http: HttpClient) {}

  register(username: string, password: string) {
    const postUrl = "/api/auth/register";
    const body = { username, password };
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  login(username: string, password: string) {
    const postUrl = "/api/auth/login";
    const body = { username, password };
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const id = payload.id || payload.sub || null;
      if (typeof id === 'number') {
        return id;
      }
      if (typeof id === 'string') {
        const numId = Number(id);
        return isNaN(numId) ? null : numId;
      }
      return null;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
}
