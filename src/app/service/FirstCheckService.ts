import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FirstCheck} from "../interface/FirstCheck";

@Injectable({
  providedIn: "root"
})
export class FirstCheckService {
  private readonly apiUrl = "http://localhost:8080/first-check";

  constructor(private readonly http: HttpClient) {
  }

  public getFirstCheck() {
    return this.http.get<FirstCheck>(this.apiUrl);
  }
}
