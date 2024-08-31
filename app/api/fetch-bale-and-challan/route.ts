import BaleModel, { IBale } from "@/lib/models/BaleModel";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ChallanModel, { IChallan } from "@/lib/models/ChallanModel";
import BaleEntryModel from "@/lib/models/BaleEntryModel";



//Note - CLient Promise is from mongo
export async function GET() {
    try {
        await dbConnect();
        const bales = await BaleModel.find({});

        return NextResponse.json(bales);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    try {

        await dbConnect();
        const body = await req.json();

        return NextResponse.json(body);


        // const bale = new BaleModel(body);
        // const result = await bale.save();
        // return NextResponse.json(result);
    } catch (error) {
        return NextResponse.error();
    }

}