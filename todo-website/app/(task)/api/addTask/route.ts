// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     // Parse the JSON body from the request
//     const body = await req.json();

//     // Destructure required fields from the request body
//     const { user_id, title, description, taskType, date } = body;

//     // Validate required fields
//     if (!user_id || !title) {
//       return NextResponse.json(
//         { error: "User ID and title are required" },
//         { status: 400 }
//       );
//     }

//     // Check if the user exists
//     const user = await prisma.users.findUnique({
//       where: { id: Number(user_id) },
//       include: { todolist: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // If the user has no todolist, create one
//     let userTodolist = user.todolist;
//     if (!userTodolist) {
//       userTodolist = await prisma.todolist.create({
//         data: {
//           user: {
//             connect: { id: user.id },
//           },
//         },
//       });
//     }

//     // Add the task to the user's todolist
//     const newTask = await prisma.task.create({
//       data: {
//         title,
//         description,
//         taskType,
//         date,
//         todolist: {
//           connect: { id: userTodolist.id }, // Connect the task to the user's todolist
//         },
//       },
//     });

//     // Return the newly created task
//     return NextResponse.json(newTask, { status: 201 });
//   } catch (error) {
//     // Handle any errors that occurred
//     console.error("Error handling POST request:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { prisma } from "@/lib/db"; // Adjust import based on your file structure
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, title, description, taskType, date } = body;

  try {
    // Validate input
    if (!user_id || !title) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(user_id) },
    });

    if (!user) {
      return NextResponse.json({ msg: "User Not Found" }, { status: 404 });
    }

    // Check if TodoList exists; create if not
    let todolist = await prisma.todoList.findUnique({
      where: { id: Number(user_id) },
    });

    if (!todolist) {
      todolist = await prisma.todoList.create({
        data: {
          user: {
            connect: { id: Number(user_id) },
          },
        },
      });
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        taskType,
        date,
        todolist: {
          connect: { id: Number(user_id) },
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
