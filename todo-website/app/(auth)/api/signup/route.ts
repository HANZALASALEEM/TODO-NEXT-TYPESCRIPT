import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { email, password, name } = body;
  if (!email || !password || !name) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      return NextResponse.json({ msg: "User Already Exists" }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return NextResponse.json(
      { msg: "New User Created", data: newUser },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { msg: "Internal Server Error", data: err },
      { status: 500 }
    );
  }
}
