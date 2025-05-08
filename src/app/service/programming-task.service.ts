import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgrammingTask } from '../interface/ProgrammingTask';

@Injectable({
  providedIn: 'root'
})
export class ProgrammingTaskService {
  private readonly baseUrl = 'http://backend:8080/programming-task';

  constructor(private readonly http: HttpClient) {}

  getProgrammingTaskById(id: number): Observable<ProgrammingTask> {
    return this.http.get<ProgrammingTask>(`${this.baseUrl}?id=${id}`);
  }
}
