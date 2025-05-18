import { HttpClient } from "@angular/common/http";
import { Student } from "../interface/Student";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { backHost } from "../app.component";

@Injectable({providedIn: "root"})
export class StudentService {
  private readonly apiUrl = backHost + "/student";

  constructor(private readonly http: HttpClient) {
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  getStudent(): Observable<Student> {
    return this.http.get<Student>(this.apiUrl);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/all`);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(this.apiUrl, student);
  }

  deleteStudent(id: number): Observable<void> {
    const param = {
      id: id
    };
    return this.http.delete<void>(this.apiUrl, {params: param});
  }

  addScore(studentId: number, score: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${studentId}/add-score`,
      null,
      {params: {score}}
    );
  }

  getLeaderboard(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/all/leaderboard`);
  }
}
