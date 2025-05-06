import {HttpClient} from "@angular/common/http";
import {Student} from "../interface/Student";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class StudentService {
  private readonly apiUrl = "http://backend:8080/student";

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

  deleteStudent(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
