import { getCurrentUser } from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import CardTask from "./(routes)/tasks/components/card";

export default async function Dashboard() {
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

  return (
    <div className="container my-8 mx-4">
      <h1 className="text-3xl">Welcome {currentUser?.username}</h1>
      <div>
        <h2 className="text-xl font-semibold mt-8">Your tasks projects</h2>
        <div className="mt-4 pb-4">Here the latest projects you have worked on</div>
        <div className="container mx-auto bg-slate-300 rounded-lg">
          {tasks.length === 0 ? (
            <div className="p-4">
              <div className="text-xl font-semibold">No tasks found</div>
              <div className="mt-4">
                You have not created any tasks yet. Create one now to get
                started.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 gap-4 p-4">
              {tasks.map((task) => (
                <CardTask key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
