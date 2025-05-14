import { Level } from "./Level";

export interface Course {
  id?: number;
  name: string;
  description: string;
  studentIds: number[];
  lessonIds: number[];
  level: Level;
}
