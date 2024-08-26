// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// function extractUserIdFromUrl(url: string): number | null {
//   const segments = url.split("/");
//   const itemId = segments[segments.length - 1];
//   return Number(itemId) || null;
// }

// async function getUserId(req: Request) {
//   const token = await getToken({ req: req as any });
//   return token?.sub;
// }

// export async function PUT(req: Request, res: Response) {
//   const body = await req.json();
//   const { title, description, taskType, date } = body;
//   const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
//   const userId = await getUserId(req);
//   try {
//     const updateItem = await prisma.task.update({
//       where: {
//         id: Number(itemId),
//         todolistId: Number(userId),
//       },
//       data: {
//         title,
//         description,
//         taskType,
//         date,
//       },
//     });

//     if (updateItem) {
//       return NextResponse.json(
//         { msg: "Item Updated Successfully", data: updateItem },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json({ msg: "Item Not Found " }, { status: 404 });
//     }
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
//   }
// }
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

export async function PUT(req: Request) {
  const body = await req.json();
  const { title, description, taskType, date } = body;
  const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
  const userId = await getUserId(req);

  if (!itemId || !userId) {
    return NextResponse.json(
      { msg: "Invalid item ID or user ID" },
      { status: 400 }
    );
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(itemId),
        todolistId: Number(userId),
      },
    });

    if (!existingTask) {
      return NextResponse.json({ msg: "Item Not Found" }, { status: 404 });
    }

    const updatedItem = await prisma.task.update({
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

    return NextResponse.json(
      { msg: "Item Updated Successfully", data: updatedItem },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

// export async function DELETE(req: Request, res: Response) {
//   const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
//   const userId = await getUserId(req);
//   try {
//     const ItemDetail = await prisma.task.delete({
//       where: {
//         id: Number(itemId),
//         todolistId: Number(userId),
//       },
//     });

//     if (ItemDetail) {
//       return NextResponse.json(
//         { msg: "Item Deleted Successfully" },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json({ msg: "Item Not Found " }, { status: 404 });
//     }
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function DELETE(req: Request) {
  const itemId = extractUserIdFromUrl(new URL(req.url).pathname);
  const userId = await getUserId(req);

  if (!itemId || !userId) {
    return NextResponse.json(
      { msg: "Invalid item ID or user ID" },
      { status: 400 }
    );
  }
  console.log(itemId);
  console.log(userId);

  try {
    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(itemId),
        todolistId: Number(userId),
      },
    });

    console.log(existingTask);
    if (!existingTask) {
      return NextResponse.json({ msg: "Item Not Found" }, { status: 404 });
    }

    const deletedItem = await prisma.task.delete({
      where: {
        id: Number(itemId),
        todolistId: Number(userId),
      },
    });

    return NextResponse.json(
      { msg: "Item Deleted Successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
