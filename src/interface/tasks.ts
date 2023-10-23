import { IBase } from "./base";
import { IUser } from "./users";

export interface ITask extends IBase {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  user?: IUser;
}
