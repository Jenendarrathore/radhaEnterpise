import ClientModel, { IClient } from "@/lib/models/ClientModel";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

//Note - CLient Promise is from mongo
export async function GET() {
    try {
        await dbConnect();
        const clients = await ClientModel.find({});
        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body: IClient = await req.json();
        const client = new ClientModel(body);
        const result = await client.save();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.error();
    }

}