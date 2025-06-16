import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenObject } from "../interface/TokenObject";
import { backHost } from "../app.component";

@Injectable({providedIn: "root"})
export class AuthService {

  private readonly apiUrl = backHost + "/api/auth";
  private readonly tokenKey = "auth_token";

  constructor(private readonly http: HttpClient) {}

  register(username: string, email: string, password: string) {
    const postUrl = "/register";
    const body = {username, email, password};
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  login(username: string, password: string) {
    const postUrl = "/login";
    const body = {username, password};
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  forgotPassword(email: string) {
    const postUrl = "/forgot-password";
    const body = {email: email};
    return this.http.post(this.apiUrl + postUrl, body); // <-- Повертаємо Observable
  }


  update(email: string, password: string) {
    const postUrl = "/update";
    const body = {email: email, password: password};
    return this.http.post(this.apiUrl + postUrl, body);
  }

  checkUsername(username: string) {
    return this.http.get<{ email: string }>(`${this.apiUrl}/check-username?username=${username}`);
  }

  verifyEmail(token: string) {
    return this.http.get<void>(`${this.apiUrl}/verify-email?token=${token}`);
  }
}
