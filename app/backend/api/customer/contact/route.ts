import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const contact = await prisma.contact.create({
      data: {
        customer_id: data.customer_id,
        name: data.name,
        mail: data.mail,
        phone: data.phone, 
      },
    });
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const contact = await prisma.contact.update({
      where: { id: data.id },
      data: {
        name: data.name,
        mail: data.mail,
        phone: data.phone,
      },
    });
    return NextResponse.json(contact, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少联系人id" }, { status: 400 });
    }
    await prisma.contact.delete({
      where: { id },
    });
    return NextResponse.json({ msg: "删除成功" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}