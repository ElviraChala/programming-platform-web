import { Injectable } from '@angular/core';
import { backHost } from "../app.component";
import { HttpClient } from "@angular/common/http";
import { InterpreterResponse } from "../interface/InterpreterResponse";
import { InterpreterRequest } from "../interface/InterpreterRequest";

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {
  private readonly apiUrl: string = backHost + "/api/interpreter";

  constructor(private readonly http: HttpClient) {}

  public checkCode(idTask:number, code:string) {
    let body: InterpreterRequest = {
      code: code
    };
    return this.http.post<InterpreterResponse>(this.apiUrl, body, {params: {id: idTask}});
  }
}
