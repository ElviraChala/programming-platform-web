import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FirstCheck } from "../interface/FirstCheck";
import { Answer } from "../interface/Answer";
import { CheckResult } from "../interface/CheckResult";

@Injectable({
  providedIn: "root"
})
export class FirstCheckService {
  private readonly apiUrl = "http://localhost:8080";

  constructor(private readonly http: HttpClient) {
  }

  public getFirstCheck() {
    const postUrl: string = "/first-check";
    return this.http.get<FirstCheck>(this.apiUrl + postUrl);
  }

  public sendAnswers(savedAnswers: Answer[]) {
    const postUrl: string = "/first-check";
    return this.http.post<CheckResult>(this.apiUrl + postUrl, savedAnswers);
  }
}
