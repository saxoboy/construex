import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    const hashedPassword = await bcryptjs.hash(password.trim(), 12);

    if (!username || !password || !email) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bad Request - Invalid Credentials",
          message: "Please check your username, email and password.",
        },
      });
    }

    // validar username que sea igual o mas de 6 caracteres
    if (username.length < 6) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bad Request - Validation Error",
          message: "Username must be at least 6 characters long.",
        },
      });
    }

    // validar email valido
    const emailValid = /\S+@\S+\.\S+/;
    if (!emailValid.test(email)) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bad Request - Validation Error",
          message:
            "Invalid email format. Please provide a valid email address.",
        },
      });
    }

    // validar password que sea igual o mas de 6 caracteres y que tenga al menos un numero
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordValid.test(password)) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Validation Error",
          message:
            "Password must be at least 6 characters long and contain at least one number.",
        },
      });
    }

    // si el usuario existe
    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userExists) {
      return NextResponse.json({
        status: 401,
        body: {
          error: "Unauthorized - Invalid Credentials",
          message: "Username or Email already exist",
        },
      });
    }

    // si el email existe
    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailExists) {
      return NextResponse.json({
        status: 401,
        body: {
          error: "Unauthorized - Invalid Credentials",
          message: "Username or Email already exist",
        },
      });
    }

    await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "User created successfully.",
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        error: "Internal Server Error",
        message: "An internal server error occurred.",
      },
    });
  }
}
