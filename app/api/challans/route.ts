import ChallanModel, { IChallan } from "@/lib/models/ChallanModel";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

//Note - CLient Promise is from mongo
export async function GET() {
    try {
        await dbConnect();
        const challans = await ChallanModel.find({}).populate('client');

        return NextResponse.json(challans);
    } catch (error) {
        console.log("errorr--------------------------------------", error);

        return NextResponse.error();
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body: IChallan = await req.json();
        const challan = new ChallanModel(body);
        const result = await challan.save();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.error();
    }

}
