import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const htmlBody = `Verify your account with this OTP ${otp}`;
    await transport.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
      to: email,
      subject: "Password Reset Request",
      text: `Please paste this OTP on the Sign Up screen`,
      html: htmlBody,
    });

    const existingOtp = await prisma.otp.findUnique({
      where: { email: email },
    });

    if (existingOtp) {
      await prisma.otp.update({
        where: { email: email },
        data: { otp: Number(otp) },
      });
    } else {
      await prisma.otp.create({
        data: { otp: Number(otp), email: email },
      });
    }

    return NextResponse.json(
      { msg: "Email send Successfully", verifiedEmail: email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Internal Server Error", data: error.message },
      { status: 500 }
    );
  }
}
