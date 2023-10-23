"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { TaskColumn, columns } from "./columns";

interface TaskClientProps {
  data: TaskColumn[];
}

const TasksClient: React.FC<TaskClientProps> = ({ data }: TaskClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Task List Console"
          description="List all the tasks in your account in order by their creation."
        />
        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/tasks/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};

export default TasksClient;
