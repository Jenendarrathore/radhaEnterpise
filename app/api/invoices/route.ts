import InvoiceModel, { IInvoice } from "@/lib/models/InvoiceModel";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await dbConnect();
        const invoices = await InvoiceModel.find({}).populate('client');
        return NextResponse.json(invoices);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body: IInvoice = await req.json();
        const invoice = new InvoiceModel(body);
        const result = await invoice.save();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.error();
    }

}