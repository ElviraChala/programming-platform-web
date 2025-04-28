import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FirstCheck} from "../interface/FirstCheck";

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

  public sendAnswers(savedAnswers: string[]) {
    const postUrl: string = "/answer-check";
    return this.http.post<boolean>(this.apiUrl + postUrl, { answers: savedAnswers });  }
}
