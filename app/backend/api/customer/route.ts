import { NextRequest, NextResponse } from 'next/server';
import { Customer } from '../../model/db';
import { prisma } from '../../lib/prisma';


export async function POST(req: NextRequest) {
  try {
    const data: Customer = await req.json();

    const createdCustomer = await prisma.customer.create({
      data: {
        id: genCustomerId(),
        name: data.name,
        status_id: data.status_id,
        tag_id: data.tag_id,
        region: data.region,
        coordinator: data.coordinator,
        position: data.position,
        recommand_person: data.recommand_person
      },
    });

    return NextResponse.json(createdCustomer, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data: Customer = await req.json();

    const createdCustomer = await prisma.customer.delete({
      data: {
        id: genCustomerId(),
        name: data.name,
        status_id: data.status_id,
        tag_id: data.tag_id,
        region: data.region,
        coordinator: data.coordinator,
        position: data.position,
        recommand_person: data.recommand_person
      },
    });

    return NextResponse.json(createdCustomer, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function genCustomerId(): string {
    return `C${crypto.randomUUID().replaceAll('-','').substring(0,10)}`;
}