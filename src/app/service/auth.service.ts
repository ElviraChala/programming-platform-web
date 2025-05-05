import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenObject } from "../interface/TokenObject";

@Injectable({providedIn: "root"})
export class AuthService {

  private readonly apiUrl = "http://localhost:8080";
  private readonly tokenKey = "auth_token";

  constructor(private readonly http: HttpClient) {}

  register(username: string, password: string) {
    const postUrl = "/api/auth/register";
    const body = {username, password};
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  login(username: string, password: string) {
    const postUrl = "/api/auth/login";
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
    const postUrl = "/api/auth/forgot-password";
    const body = {email: email};
    this.http.post(this.apiUrl + postUrl, body).subscribe();
  }
}
