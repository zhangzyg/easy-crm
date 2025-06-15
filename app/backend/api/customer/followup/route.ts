import prisma from "@/app/backend/lib/prisma";
import { CustomerFollowUp } from "@/app/backend/model/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId") as string;

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId parameter" },
        { status: 400 }
      );
    }

    const followUps = await prisma.customerFollowUp.findMany({
      where: { customer_id: customerId },
    });

    return NextResponse.json(followUps);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const data = (await req.json()) as CustomerFollowUp;

  const followUp = await prisma.customerFollowUp.create({
    data,
  });

  return NextResponse.json(followUp, { status: 201 });
}

export async function PUT(req: Request) {
  const data = (await req.json()) as CustomerFollowUp;
  const followUpId = data.id;
  const res = await prisma.customerFollowUp.update({
    where: { id: followUpId },
    data: data,
  });

  return NextResponse.json(res, { status: 200 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const followUpId = searchParams.get("followUpId") as string;
  await prisma.customerFollowUp.delete({
    where: {
      id: followUpId,
    },
  });
  return NextResponse.json({ message: "Customer FollowUp deleted successfully" }, { status: 200 });
}
