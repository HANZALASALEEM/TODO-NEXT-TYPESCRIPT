import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { email, password, name, typeOtp } = body;
  const currentTime = new Date();
  //TODO: currentTime.setSeconds(currentTime.getSeconds() + 3600).toString();

  if (!email || !password || !name) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }
  try {
    const existingOtp = await prisma.otp.findUnique({
      where: { email: email },
    });
    if (existingOtp) {
      if (existingOtp?.expireAt! > currentTime) {
        if (existingOtp?.otp === Number(typeOtp)) {
          const findUser = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (findUser) {
            return NextResponse.json(
              { msg: "User Already Exists" },
              { status: 409 }
            );
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
            }, //?: No need to add a new feild verified with bolean because of verification in signUp route
          });
          return NextResponse.json(
            { msg: "New User Created", data: newUser },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            { msg: "Your Given OTP is Wrong" },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { msg: "Your OTP is Expired Get a new One" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json({ msg: "Get OTP First" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json(
      { msg: "Internal Server Error", data: err },
      { status: 500 }
    );
  }
}
