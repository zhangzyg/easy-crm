import { NextResponse } from 'next/server' // 你的 prisma client 实例
import { prisma } from '../../lib/prisma'

export async function POST(request: Request) {
  try {
    const { type, label, color } = await request.json()

    if (!type || !label || !color) {
      return NextResponse.json({ error: 'Missing required fields: type, label, color' }, { status: 400 })
    }

    const validTypes = ['status', 'tag', 'projectType', 'projectStatus', 'followUpStatus']

    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    let createdRecord

    switch (type) {
      case 'status':
        createdRecord = await prisma.status.create({ data: { label, color } })
        break
      case 'tag':
        createdRecord = await prisma.tag.create({ data: { label, color } })
        break
      case 'projectType':
        createdRecord = await prisma.projectType.create({ data: { label, color } })
        break
      case 'projectStatus':
        createdRecord = await prisma.projectStatus.create({ data: { label, color } })
        break
      case 'followUpStatus':
        createdRecord = await prisma.followUpStatus.create({ data: { label, color } })
        break
    }

    return NextResponse.json(createdRecord, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Label or color already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}