import {Level} from "./Level";
import {User} from "./User";

export interface Student extends User {
  score: number;
  coursesId: number[];
  isFirst: boolean;
  level: Level;
}
