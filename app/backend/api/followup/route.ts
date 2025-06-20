import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// 获取所有 FollowUps（支持通过 projectId 查询）
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    const followUps = await prisma.followUp.findMany({
      where: { project_id: projectId },
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

// 新建 FollowUp
export async function POST(req: Request) {
  const data = (await req.json()) as any;
  console.log(JSON.stringify(data));
  const followUp = await prisma.followUp.create({
    data: {
      content: data.stage,
      project_id: data.project_id,
      project_time: new Date(data.date),
    },
  });

  return NextResponse.json(followUp, { status: 201 });
}

export async function PUT(req: Request) {
  const data = (await req.json()) as any;
  const followUpId = data.id;
  const followUp = await prisma.followUp.update({
    where: { id: followUpId }, 
    data: {
      content: data.stage,
      project_id: data.project_id,
      project_time: new Date(data.date),
    }
  });

  return NextResponse.json(followUp, { status: 200 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const followUpId = searchParams.get("followUpId") as string;
  await prisma.followUp.delete({
    where: {
      id: followUpId,
    },
  });
  return NextResponse.json({ message: "FollowUp deleted successfully" }, { status: 200 });
}
