import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { password, token } = body;

  try {
    const saveToken = await prisma.user.update({
      where: {
        token: token,
      },
      data: {
        password: password,
      },
    });

    console.log("Message sent");
    return NextResponse.json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", data: err },
      { status: 500 }
    );
  }
}
