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
        console.log("body");
        console.log(body);
        const challanBody = {
            client: body.client,
            challanNumber: body.challanNumber,
            totalMeters: body.totalMeters,
            quality: body.quality,
            width: body.width,
            challanDate: body.challanDate,
            pcs: body.pcs,
            fold: body.fold,
            rate: body.rate,
            challanAmount: body.challanAmount
        }
        const challan = new ChallanModel(challanBody);
        const newChallan = await challan.save();
        for (let i = 0; i < body.lots.length; i++) {
            const bale = body.lots[i];
            const baleBody = {
                challan: newChallan._id,
                baleCount: bale.baleCount,
                totalMeters: bale.totalMeters,

            }
            const newbaleData = new BaleModel(baleBody);
            const newBale = await newbaleData.save();
            for (let j = 0; j < bale.entries.length; j++) {
                const entry = bale.entries[j];
                const baleEntryData = {
                    bale: newBale._id,
                    meters: entry.meters
                }
                const newbaleEntryData = new BaleEntryModel(baleEntryData);
                const newbaleEntry = await newbaleEntryData.save();
            }
        }

        return NextResponse.json(newChallan);


        // const bale = new BaleModel(body);
        // const result = await bale.save();
        // return NextResponse.json(result);
    } catch (error) {
        return NextResponse.error();
    }

}