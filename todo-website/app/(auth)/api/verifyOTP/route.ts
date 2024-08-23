import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, typeOtp } = body;

  try {
    const existingOtp = await prisma.otp.findUnique({
      where: { email: email },
    });

    if (existingOtp) {
      if (existingOtp?.otp === Number(typeOtp)) {
        return NextResponse.json(
          { msg: "Verification Complete... Please SignUp" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { msg: "Your Given OTP is Wrong" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ msg: "Get OTP First" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json(
      { msg: "Internal Server Error", data: error.message },
      { status: 500 }
    );
  }
}
