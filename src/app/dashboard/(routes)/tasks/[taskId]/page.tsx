import prismadb from "@/lib/prismadb";
import TaskForm from "./components/taskForm";

const TaskPage = async ({ params }: { params: { taskId: string } }) => {
  let task;
  let edit = false;

  if (params.taskId === "new") {
    task = null;
  } else {
    task = await prismadb.task.findUnique({
      where: {
        id: params.taskId,
      },
    });
  }
  if (task) {
    edit = true;
  }

  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <TaskForm initialData={task} edit={edit} />
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
