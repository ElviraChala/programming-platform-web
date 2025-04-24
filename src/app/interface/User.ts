import {Role} from "./Role";

export interface User {

  id: number;
  username: string;
  name?: string;
  password?: string;
  email?: string;
  role: Role;
}
