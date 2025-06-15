import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as string;
        const idParam = searchParams.get('id') as string;
        const id = Number.parseInt(idParam);

        if (!type || !id) {
            return NextResponse.json({ error: 'Missing required fields: type, label, color' }, { status: 400 })
        }

        const validTypes = ['status', 'tag', 'projectType', 'projectStatus', 'followUpStatus']

        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        switch (type) {
            case 'status':
                await prisma.status.delete({ where: { id } })
                break
            case 'tag':
                await prisma.tag.delete({ where: { id } })
                break
            case 'projectType':
                await prisma.projectType.delete({ where: { id } })
                break
            case 'projectStatus':
                await prisma.projectStatus.delete({ where: { id } })
                break
            case 'followUpStatus':
                await prisma.followUpStatus.delete({ where: { id } })
                break
        }

        return NextResponse.json({ id }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as string;
        if (!type) {
            return NextResponse.json({ error: 'Missing required field: type' }, { status: 400 })
        }

        const validTypes = ['status', 'tag', 'projectType', 'projectStatus', 'followUpStatus']

        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        let records

        switch (type) {
            case 'status':
                records = await prisma.status.findMany()
                break
            case 'tag':
                records = await prisma.tag.findMany()
                break
            case 'projectType':
                records = await prisma.projectType.findMany()
                break
            case 'projectStatus':
                records = await prisma.projectStatus.findMany()
                break
            case 'followUpStatus':
                records = await prisma.followUpStatus.findMany()
                break
        }

        return NextResponse.json(records, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}