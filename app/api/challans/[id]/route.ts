// app/api/challans/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ChallanModel, { IChallan } from '@/lib/models/ChallanModel';

// GET a single challan by ID
export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const challanData = await ChallanModel.findById(id);

        return NextResponse.json(challanData);
    } catch (error) {
        return NextResponse.error();
    }
}

// PUT to update a challan by ID
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body: IChallan = await req.json();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const challan = await ChallanModel.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(challan);
    } catch (error) {
        return NextResponse.error();
    }
}

// DELETE a challan by ID
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const deleteClient = await ChallanModel.findByIdAndDelete(id);

        return NextResponse.json(deleteClient);
    } catch (error) {
        return NextResponse.error();
    }
}
