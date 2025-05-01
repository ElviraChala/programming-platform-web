import { Question } from "./Question";

export interface CheckKnowledge {
  id: number;
  questions: Question[];
  lessonId: number;
}
