import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, res: Response) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const todoListId = searchParams.get("userId");
  const itemId = searchParams.get("itemId");

  try {
    const ItemDetail = await prisma.task.delete({
      where: {
        id: Number(itemId),
        todolistId: Number(todoListId),
      },
    });

    if (ItemDetail) {
      return NextResponse.json(
        { msg: "Item Deleted Successfully" },
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
