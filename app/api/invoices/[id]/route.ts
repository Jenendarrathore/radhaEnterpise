// app/api/invoices/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InvoiceModel, { IInvoice } from '@/lib/models/InvoiceModel';

// GET a single invoice by ID
export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const invoiceData = await InvoiceModel.findById(id).populate(['client', 'challan']);
        return NextResponse.json(invoiceData);
    } catch (error) {
        console.log("error--------------------------------------------------------------------------------", error)

        return NextResponse.error();
    }
}

// PUT to update a invoice by ID
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body: IInvoice = await req.json();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const invoice = await InvoiceModel.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(invoice);
    } catch (error) {
        return NextResponse.error();
    }
}

// DELETE a invoice by ID
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const deleteInvoice = await InvoiceModel.findByIdAndDelete(id);

        return NextResponse.json(deleteInvoice);
    } catch (error) {
        return NextResponse.error();
    }
}
