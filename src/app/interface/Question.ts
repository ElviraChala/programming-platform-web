import {QueryList} from "@angular/core";

export interface Question {
  id: number;
  text: string;
  options: QueryList<string>;
  correctAnswer: string;
  checkKnowledgeId?: number;
}
