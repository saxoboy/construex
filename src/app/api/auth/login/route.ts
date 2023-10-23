import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    const username = body.username.toLowerCase().trim();

    if (!username || !password) {
      return NextResponse.json({
        status: 400,
        body: {
          error: "Bad Request - Invalid Credentials",
          message: "Please check your username and password.",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    console.log(user);

    if (!user) {
      return NextResponse.json({
        status: 401,
        body: {
          error: "Unauthorized - Invalid Credentials",
          message: "Username or password is incorrect.",
        },
      });
    }

    // compare passwords
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({
        status: 401,
        body: {
          error: "Unauthorized - Invalid Credentials",
          message: "Username or passwor is incorrect.",
        },
      });
    }

    // create and assign a token
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    // // Verifica el token (opcional)
    // jwt.verify(token, process.env.TOKEN_SECRET!, (err, decoded) => {
    //   if (err) {
    //     // El token no es válido
    //     console.error("Token no válido:", err);
    //   } else {
    //     // El token es válido
    //     console.log("Token válido. Datos del usuario:", decoded);
    //   }
    // });

    // res.cookies.set("auth_cookie", token, {
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: process.env.TOKEN_EXPIRES_IN as unknown as number,
    //   path: "/",
    // });

    cookies().set({
      name: "auth_cookie",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: process.env.TOKEN_EXPIRES_IN as unknown as number,
    });

    return NextResponse.json({
      status: 200,
      body: {
        message: "Login successful",
        accessToken: token,
        expiresIn: process.env.TOKEN_EXPIRES_IN,
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
