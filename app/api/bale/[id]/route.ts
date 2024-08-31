// app/api/bales/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BaleModel, { IBale } from '@/lib/models/BaleModel';

// GET a single bale by ID
export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const baleData = await BaleModel.findById(id);

        return NextResponse.json(baleData);
    } catch (error) {
        return NextResponse.error();
    }
}

// PUT to update a bale by ID
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body: IBale = await req.json();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const bale = await BaleModel.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(bale);
    } catch (error) {
        return NextResponse.error();
    }
}

// DELETE a bale by ID
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const deleteClient = await BaleModel.findByIdAndDelete(id);

        return NextResponse.json(deleteClient);
    } catch (error) {
        return NextResponse.error();
    }
}
