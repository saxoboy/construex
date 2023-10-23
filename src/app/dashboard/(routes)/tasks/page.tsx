import { format } from "date-fns";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import TasksClient from "./components/client";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { ITask } from "@/interface/tasks";
import { TaskColumn } from "./components/columns";
import { enUS } from "date-fns/locale";

const TaskPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }

  const tasks = await prismadb.task.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  if (!tasks) {
    redirect("/");
  }

  const formattedTasks: TaskColumn[] = tasks.map((task: ITask) => {
    return {
      id: task.id,
      title: task.title,
      dueDate: task.dueDate
        ? format(new Date(task.dueDate), "EEEE, dd MMMM, yyyy", {
            locale: enUS,
          })
        : null,
      createdAt: task.createdAt
        ? format(new Date(task.createdAt), "EEEE, dd MMMM, yyyy HH:mm:ss", {
            locale: enUS,
          })
        : format(new Date(), "EEEE, dd MMMM, yyyy HH:mm:ss", {
            locale: enUS,
          }),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TasksClient data={formattedTasks} />
      </div>
    </div>
  );
};

export default TaskPage;
