import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { title, description, brand, sellerName, price } = body;
  if (!title || !description || !brand || !sellerName || !price) {
    return NextResponse.json(
      { msg: "All Fields are Required" },
      { status: 400 }
    );
  }

  try {
    const newProduct = await prisma.products.create({
      data: {
        title: title,
        description: description,
        brand: brand,
        sellerName: sellerName,
        price: parseInt(price),
      },
    });
    return NextResponse.json(
      { msg: "New Product Added In Database", data: newProduct },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
