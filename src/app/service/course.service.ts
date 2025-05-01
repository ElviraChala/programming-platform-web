import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from "../interface/Course";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly baseUrl = 'http://localhost:8080/course'; // заміни на свій backend URL, якщо інший

  constructor(private readonly http: HttpClient) {}

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}`, course);
  }

  getCourseById(id: number): Observable<Course> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Course>(`${this.baseUrl}`, { params });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/all`);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.baseUrl}`, { params });
  }
}
