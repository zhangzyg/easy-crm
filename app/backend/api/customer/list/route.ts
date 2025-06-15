import prisma from "@/app/backend/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const customer = await prisma.customer.findMany({
      include: {
        Contact: {
          select: {
            name: true,
            phone: true,
          },
        },
        CustomerFollowUp: {
            select: {
              created_time: true  
            }
        }
      },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer list not found" }, { status: 404 });
    } else {
      return NextResponse.json(customer, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
