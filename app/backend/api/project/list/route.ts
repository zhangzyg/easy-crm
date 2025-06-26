
import prisma from "@/app/backend/lib/prisma";
import Decimal from "decimal.js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const project = await prisma.project.findMany();
    const projectDtos = await Promise.all(project.map(async (item) => {
      const status = await prisma.projectStatus.findUnique({
        where: { id: item.status_id }
      });
      return {
        projectId: item.id,
        projectName: item.name,
        customer_id: item.customer_id,
        amount: item.amount,
        paid: item.paid,
        status_id: status?.id
      };
    }));
    const totalAmount = projectDtos
      .map(dto => new Decimal(dto.amount))
      .reduce((acc, cur) => acc.add(cur), new Decimal(0)).toFixed(2);
    const totalPaidAmount = projectDtos
      .map(dto => new Decimal(dto.paid))
      .reduce((acc, cur) => acc.add(cur), new Decimal(0)).toFixed(2);
    return NextResponse.json({
      projects: projectDtos,
      totalAmount,
      totalPaidAmount
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}