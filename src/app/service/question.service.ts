import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Question} from "../interface/Question";
import { backHost } from "../app.component";

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  private readonly apiUrl = backHost + "/question";

  constructor(private readonly http: HttpClient) {
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  getQuestionById(id: number): Observable<Question> {
    // Перевірка на коректність id
    if (!id) {
      throw new Error('ID питання не може бути порожнім');
    }
    const params = new HttpParams().set("id", id);
    return this.http.get<Question>(this.apiUrl, { params });
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/all`);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(this.apiUrl, question);
  }

  deleteQuestion(id: string): Observable<void> {
    if (!id) {
      throw new Error('ID питання не може бути порожнім');
    }
    const params = new HttpParams().set("id", id);
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
