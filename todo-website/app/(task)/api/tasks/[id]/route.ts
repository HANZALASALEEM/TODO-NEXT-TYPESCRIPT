import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function extractUserIdFromUrl(url: string): number | null {
  const segments = url.split("/");
  const itemId = segments[segments.length - 1];
  return Number(itemId) || null;
}

async function getUserId(req: Request) {
  const token = await getToken({ req: req as any });
  return token?.sub;
}

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const { title, description, taskType, date } = body;
  const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
  const userId = await getUserId(req);
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

export async function DELETE(req: Request, res: Response) {
  const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
  const userId = await getUserId(req);
  try {
    const ItemDetail = await prisma.task.delete({
      where: {
        id: Number(itemId),
        todolistId: Number(userId),
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
