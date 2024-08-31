// app/api/clients/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ClientModel, { IClient } from '@/lib/models/ClientModel';

// GET a single client by ID
export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const clientData = await ClientModel.findById(id);

        return NextResponse.json(clientData);
    } catch (error) {
        return NextResponse.error();
    }
}

// PUT to update a client by ID
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body: IClient = await req.json();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const client = await ClientModel.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.error();
    }
}

// DELETE a client by ID
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const deleteClient = await ClientModel.findByIdAndDelete(id);

        return NextResponse.json(deleteClient);
    } catch (error) {
        return NextResponse.error();
    }
}
