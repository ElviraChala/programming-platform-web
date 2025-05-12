import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgrammingTask } from '../interface/ProgrammingTask';
import { backHost } from "../app.component";

@Injectable({
  providedIn: 'root'
})
export class ProgrammingTaskService {
  private readonly baseUrl = backHost + "/programming-task";

  constructor(private readonly http: HttpClient) {}

  getProgrammingTaskById(id: number): Observable<ProgrammingTask> {
    return this.http.get<ProgrammingTask>(`${this.baseUrl}?id=${id}`);
  }
}
