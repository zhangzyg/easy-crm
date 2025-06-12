import { prisma } from "@/app/backend/lib/prisma";
import { genProjectId } from "@/app/backend/util";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const project = await prisma.project.create({
      data: {
        customer_id: data.customer_id,
        name: data.name,
        type_id: data.type_id,
        status_id: data.status_id,
        description: data.description,
        id: genProjectId(),
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type_id: data.type_id,
        status_id: data.status_id,
        description: data.description,
      },
    });
    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") as string;
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId parameter" }, { status: 400 });
    }

    await prisma.followUp.deleteMany({
      where: { project_id: projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
