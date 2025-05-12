import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Lesson } from "../interface/Lesson";
import { backHost } from "../app.component";

@Injectable({
  providedIn: "root"
})
export class LessonService {
  private readonly baseUrl = backHost + "/lesson"; // або в env файлі

  constructor(private readonly http: HttpClient) {}

  createLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.baseUrl, lesson);
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.baseUrl}/${id}`);
  }

  getAllLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/all`);
  }

  updateLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.put<Lesson>(this.baseUrl, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
