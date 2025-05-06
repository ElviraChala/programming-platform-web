import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { CheckKnowledge } from "../interface/CheckKnowledge";
import { Question } from "../interface/Question";
import { Answer } from "../interface/Answer";

@Injectable({
  providedIn: "root"
})
export class CheckKnowledgeService {
  private readonly baseUrl = `http://backend:8080/check-knowledge`;

  constructor(private readonly http: HttpClient) {}

  create(check: CheckKnowledge): Observable<CheckKnowledge> {
    return this.http.post<CheckKnowledge>(this.baseUrl, check);
  }

  getById(id: number): Observable<CheckKnowledge> {
    const params = new HttpParams().set("id", id.toString());
    return this.http.get<CheckKnowledge>(this.baseUrl, {params});
  }

  getQuestions(id: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/${id}/questions`);
  }

  submitAnswers(id: number, answers: Answer[]): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/${id}/submit`, answers);
  }

  update(check: CheckKnowledge): Observable<CheckKnowledge> {
    return this.http.put<CheckKnowledge>(this.baseUrl, check);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
