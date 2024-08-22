import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

async function getUserId(req: Request) {
  const token = await getToken({
    req: req as any,
  });
  console.log(token);
  return token?.sub;
}

export async function GET(req: Request) {
  const userId = await getUserId(req);
  //   const url = new URL(req.url);
  //   const searchParams = new URLSearchParams(url.searchParams);
  //   const userId = searchParams.get("id");
  console.log("User ID : ", userId);

  if (!userId) {
    return NextResponse.json(
      { msg: "Unauthorized: User ID is required" },
      { status: 401 }
    );
  }

  try {
    const userDetail = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (userDetail) {
      return NextResponse.json(
        { msg: "User Fetched Successfully", data: userDetail },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ msg: "Item Not Found" }, { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
