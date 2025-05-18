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

  createProgrammingTask(task: ProgrammingTask): Observable<ProgrammingTask> {
    return this.http.post<ProgrammingTask>(this.baseUrl, task);
  }

  getProgrammingTaskById(id: number): Observable<ProgrammingTask> {
    return this.http.get<ProgrammingTask>(`${this.baseUrl}?id=${id}`);
  }

  getAllProgrammingTasks(): Observable<ProgrammingTask[]> {
    return this.http.get<ProgrammingTask[]>(`${this.baseUrl}/all`);
  }

  updateProgrammingTask(task: ProgrammingTask): Observable<ProgrammingTask> {
    return this.http.put<ProgrammingTask>(this.baseUrl, task);
  }

  deleteProgrammingTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}`, {params: {id: id}});
  }
}
