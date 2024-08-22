import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
import { randomstring } from "randomstring";

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
    return NextResponse.json(
      { msg: "Email send Successfully", otp: otp, verifiedEmail: email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Internal Server Error", data: error.message },
      { status: 500 }
    );
  }
}
