import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ITask } from "@/interface/tasks";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface TaskCardProps {
  task: ITask;
}
const CardTask = ({ task }: TaskCardProps) => {
  const dueDate = task.dueDate
    ? format(new Date(task.dueDate), "EEEE, dd MMMM, yyyy", {
        locale: enUS,
      })
    : null;

  const dueDateShort = task.dueDate
    ? format(new Date(task.dueDate), "dd MMMM, yyyy", {
        locale: enUS,
      })
    : null;

  const now = new Date();
  now.setDate(now.getDate() - 1); // Resta un día a la fecha actual
  const isOverdue = task.dueDate <= now;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription className="text-base">{dueDate}</CardDescription>
      </CardHeader>
      <CardContent className="text-base">{task.description}</CardContent>
      <CardFooter className="flex flex-col justify-start pb-4">
        {isOverdue ? (
          <div>
            <span className="text-sm text-red-500 italic">
              This task is overdue
            </span>
          </div>
        ) : (
          <div>
            <span className="text-sm italic">
              You have until the {dueDateShort} for this task
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardTask;
