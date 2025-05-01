import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Theory } from "../interface/Theory";

@Injectable({
  providedIn: "root"
})
export class TheoryService {

  private readonly baseUrl = "http://localhost:8080/theory"; // заміни на змінну середовища при потребі

  constructor(private readonly http: HttpClient) {}

  createTheory(theory: Theory): Observable<Theory> {
    return this.http.post<Theory>(this.baseUrl, theory);
  }

  getTheoryById(id: number): Observable<Theory> {
    const params = new HttpParams().set("id", id.toString());
    return this.http.get<Theory>(this.baseUrl, {params});
  }

  getAllTheories(): Observable<Theory[]> {
    return this.http.get<Theory[]>(`${this.baseUrl}/all`);
  }

  updateTheory(theory: Theory): Observable<Theory> {
    return this.http.put<Theory>(this.baseUrl, theory);
  }

  deleteTheory(id: number): Observable<void> {
    const params = new HttpParams().set("id", id.toString());
    return this.http.delete<void>(this.baseUrl, {params});
  }
}
