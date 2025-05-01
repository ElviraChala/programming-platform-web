import { Theory } from "./Theory";

export interface Lesson {
  id: number;
  name: string;
  orderIndex: number;
  courseId: number;
  theory: Theory;
  checkKnowledgeId: number;
  programmingTaskIds: number[];
}
