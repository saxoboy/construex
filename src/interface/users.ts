import { IBase } from "./base";
import { ITask } from "./tasks";

export interface IUser extends IBase {
  username: string;
  email: string;
  password: string;
  tasks?: ITask[];
}
