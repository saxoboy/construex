import { NextResponse, NextRequest } from "next/server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect("/login");
    }

    if (!params.taskId) {
      return new NextResponse("Task id is required", { status: 400 });
    }

    const task = await prismadb.task.findUnique({
      where: {
        id: params.taskId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect("/login");
    }

    if (!params.taskId) {
      return new NextResponse("Task id is required", { status: 400 });
    }

    const body = await req.json();
    const { title, description, dueDate } = body;

    if (!title || !description || !dueDate) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bad Request - Invalid Credentials",
          message: "Please check your title, description and dueDate.",
        },
      });
    }

    const task = await prismadb.task.update({
      where: {
        id: params.taskId,
      },
      data: {
        title,
        description,
        dueDate,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        task,
      },
    });
  } catch (error) {
    console.log("[TASK_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect("/login");
    }

    if (!params.taskId) {
      return new NextResponse("Task id is required", { status: 400 });
    }

    const task = await prismadb.task.delete({
      where: {
        id: params.taskId,
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        task,
      },
    });
  } catch (error) {
    console.log("[TASK_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
