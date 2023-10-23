"use client";
import * as z from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ITask } from "@/interface/tasks";
import { toast } from "@/components/ui/use-toast";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  dueDate: z.date({ required_error: "Due date is required" }),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  edit?: boolean;
  initialData: ITask | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ edit = false, initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = edit && initialData?.title ? "Edit Task" : "Create Task";
  const description =
    edit && initialData?.title ? "Edit a Task" : "Create a new Task";
  const action = edit ? "Edit Task" : "Create";

  const defaultValues = initialData
    ? { ...initialData }
    : {
        id: "",
        title: "",
        description: "",
        dueDate: new Date(),
      };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = () => {
    form.reset();
  };

  const onCancel = () => {
    resetForm();
    router.back();
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await fetch(`/api/tasks/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      router.refresh();
      router.push("/dashboard/tasks");

      toast({
        variant: "success",
        title: "A new task has been created",
        description: "Task created successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {}}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid gap-4 pb-4 w-full lg:w-[800px] mx-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="title"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block">Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>elegir fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="destructive" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button variant="outline" disabled={loading} type="submit">
                {action}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;
