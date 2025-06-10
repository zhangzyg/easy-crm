import { NextRequest, NextResponse } from 'next/server';
import { Customer } from '../../model/db';
import { prisma } from '../../lib/prisma';
import { genCustomerId } from '../../util';


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
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId') as string;
    await prisma.followUp.delete({
        where: {
            id: customerId,
        },
    })

    return NextResponse.json('customer deleted', { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data: Customer = await req.json();

    const updatedCustomer = await prisma.customer.update({
      where: { id: data.id },
      data: {
        name: data.name,
        status_id: data.status_id,
        tag_id: data.tag_id,
        region: data.region,
        coordinator: data.coordinator,
        position: data.position,
        recommand_person: data.recommand_person,
      },
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId') as string;

    try {
      const customer = await prisma.customer.findUnique({
        where: { customerId },
        include: {
          projects: true,
          customerFollowUps: true,
        },
      });
      if (!customer) {
        NextResponse.json({ error: 'Customer not found' }, {status: 404});
      } else {
         NextResponse.json(customer, {status: 200});
      }
    } catch (error) {
      console.error(error);
      NextResponse.json({ error: 'Server error' }, {status: 500});
    }
}