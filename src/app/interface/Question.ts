import {QueryList} from "@angular/core";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  checkKnowledgeId?: number;
}
