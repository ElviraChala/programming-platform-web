import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {TokenObject} from "../interface/TokenObject";

@Injectable({providedIn: "root"})
export class AuthService {

  private readonly apiUrl = "http://localhost:8080";

  constructor(private readonly http: HttpClient) {
  }

  register(username: string, password: string) {
    let postUrl = "/api/auth/register";
    const body = {
      "username": username,
      "password": password
    };
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }

  login(username: string, password: string) {
    let postUrl = "/api/auth/login";
    const body = {
      "username": username,
      "password": password
    };
    return this.http.post<TokenObject>(this.apiUrl + postUrl, body);
  }
}
