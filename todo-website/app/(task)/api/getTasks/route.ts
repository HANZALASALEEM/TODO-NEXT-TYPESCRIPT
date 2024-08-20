import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  try {
    const todolist = await prisma.todoList.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tasks: true,
      },
    });

    if (todolist) {
      return NextResponse.json(
        { msg: "Task List Fetched Successfully", data: todolist },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { msg: "No Items Found in Task List" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Internal Server Error", genratedMsg: err },
      { status: 500 }
    );
  }
}
