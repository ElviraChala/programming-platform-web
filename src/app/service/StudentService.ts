import {HttpClient, HttpParams} from "@angular/common/http";
import {Student} from "../interface/Student";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class StudentService {
  private readonly apiUrl = "http://localhost:8080/student";

  constructor(private readonly http: HttpClient) {
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  getStudentById(id: string): Observable<Student> {
    const params = new HttpParams().set("id", id);
    return this.http.get<Student>(this.apiUrl, {params});
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/all`);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(this.apiUrl, student);
  }

  deleteStudent(id: number): Observable<void> {
    const params = new HttpParams().set("id", id.toString());
    return this.http.delete<void>(this.apiUrl, {params});
  }
}
