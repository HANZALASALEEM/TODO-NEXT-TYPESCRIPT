import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  //   const url = new URL(req.url);
  //   const searchParams = new URLSearchParams(url.searchParams);
  //   const todoListId = searchParams.get("userId");
  //   const itemId = searchParams.get("itemId");

  const body = await req.json();
  const { itemId, userId, title, description, taskType, date } = body;

  try {
    const updateItem = await prisma.task.update({
      where: {
        id: Number(itemId),
        todolistId: Number(userId),
      },
      data: {
        title,
        description,
        taskType,
        date,
      },
    });

    if (updateItem) {
      return NextResponse.json(
        { msg: "Item Updated Successfully", data: updateItem },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ msg: "Item Not Found " }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
