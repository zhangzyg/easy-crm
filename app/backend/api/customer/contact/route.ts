import prisma from "@/app/backend/lib/prisma";
import { Contact } from "@/app/component/CustomerDetail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as Contact;
    let createdContacts;
    if (data.phone) {
      const contactsToCreate = data.phone.map((phoneNumber) => ({
        customer_id: data.customer_id,
        name: data.name,
        mail: data.mail,
        phone: phoneNumber,
      }));
      createdContacts = await prisma.contact.createMany({
        data: contactsToCreate,
        skipDuplicates: true,
      });
    } else {
      createdContacts = await prisma.contact.create({
        data: {
          customer_id: data.customer_id,
          name: data.name,
          mail: data.mail,
          phone: ''
        },
      });
    }

    return NextResponse.json(createdContacts, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("contactName") as string;
    if (!name) {
      return NextResponse.json({ error: "缺少联系人姓名" }, { status: 400 });
    }
    await prisma.contact.deleteMany({
      where: { name },
    });
    const data = await req.json() as Contact;
    let createdContacts;
    if (data.phone) {
      const contactsToCreate = data.phone.map((phoneNumber) => ({
        customer_id: data.customer_id,
        name: data.name,
        mail: data.mail,
        phone: phoneNumber,
      }));
      createdContacts = await prisma.contact.createMany({
        data: contactsToCreate,
        skipDuplicates: true,
      });
    } else {
      createdContacts = await prisma.contact.create({
        data: {
          customer_id: data.customer_id,
          name: data.name,
          mail: data.mail,
          phone: ''
        },
      });
    }

    return NextResponse.json(createdContacts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("contactName") as string;
    if (!name) {
      return NextResponse.json({ error: "缺少联系人姓名" }, { status: 400 });
    }
    await prisma.contact.deleteMany({
      where: { name },
    });
    return NextResponse.json({ msg: "删除成功" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}