import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, title, description, taskType, date } = body;

  try {
    if (!userId || !title) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ msg: "User Not Found" }, { status: 404 });
    }

    let todolist = await prisma.todoList.findUnique({
      where: { id: Number(userId) },
    });

    if (!todolist) {
      todolist = await prisma.todoList.create({
        data: {
          user: {
            connect: { id: Number(userId) },
          },
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        taskType,
        date,
        todolist: {
          connect: { id: Number(userId) },
        },
      },
    });

    return NextResponse.json(
      { msg: "Task Added Successfully", data: task },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  const todoListId = searchParams.get("userId");
  const itemId = searchParams.get("itemId");

  if (id) {
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
  } else if (todoListId && itemId) {
    try {
      const ItemDetail = await prisma.task.findUnique({
        where: {
          id: Number(itemId),
          todolistId: Number(todoListId),
        },
      });

      if (ItemDetail) {
        return NextResponse.json(
          { msg: "Item Fetched Successfully", data: ItemDetail },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ msg: "Item Not Found " }, { status: 404 });
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req: Request, res: Response) {
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
