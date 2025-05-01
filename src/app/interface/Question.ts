import { Level } from "./Level";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  checkKnowledgeId?: number;
  level: Level;
}
