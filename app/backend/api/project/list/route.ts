import { prisma } from "@/app/backend/lib/prisma";
import { Project } from "@/app/backend/model/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const project = await prisma.project.findMany() as Project[];
    const projectDtos = await Promise.all(project.map(async (item) => {
         const cutomerName = await prisma.customer.findUnique({
                where: { id: item.customer_id }
            });
         const status = await prisma.projectStatus.findUnique({
                where: { id: item.status_id }
          });
        return {
            projectId: item.id,
            projectName: item.name,
            cutomerName,
            amount: item.amount,
            paid: item.paid,
            status
        };
    }));
    const totalAmount = projectDtos.map(dto => dto.amount).reduce((acc, cur) => acc + cur, 0);
    const totalPaidAmount = projectDtos.map(dto => dto.paid).reduce((acc, cur) => acc + cur, 0);
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