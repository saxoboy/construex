import { NextResponse, NextRequest } from "next/server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect("/login");
    }

    const body = await request.json();
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

    // crear nueva task
    const task = await prismadb.task.create({
      data: {        
        title,
        description,
        dueDate,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        task,
      },
    });
  } catch (error) {
    console.log("[TASK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect("/login");
    }

    const tasks = await prismadb.task.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        tasks,
      },
    });
  } catch (error) {
    console.log("[TASK_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
