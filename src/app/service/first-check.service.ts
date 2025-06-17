import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FirstCheck } from "../interface/FirstCheck";
import { Answer } from "../interface/Answer";
import { CheckResult } from "../interface/CheckResult";
import { backHost } from "../app.component";

@Injectable({
  providedIn: "root"
})
export class FirstCheckService {
  private readonly apiUrl = backHost;

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

  public updateFirstCheck(firstCheck: FirstCheck) {
    const postUrl: string = "/first-check/update";
    return this.http.put<FirstCheck>(this.apiUrl + postUrl, firstCheck);
  }
}
