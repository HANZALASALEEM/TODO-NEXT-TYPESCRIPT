import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (findUser) {
      const token = nanoid(32);
      const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const htmlBody = `Click here to <a href="http://localhost:3000/resetPassword/${token}">Reset Password</a>`;
      await transport.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        to: email,
        subject: "Password Reset Request",
        text: `Please reset your password by clicking on the link: http://localhost:3000/resetPassword/${token}`,
        html: htmlBody,
      });

      const saveToken = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          token: token,
        },
      });

      return NextResponse.json({ msg: "Password reset email sent" });
    } else {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", data: err },
      { status: 500 }
    );
  }
}
