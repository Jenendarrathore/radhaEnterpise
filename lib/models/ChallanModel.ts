import mongoose, { Schema } from "mongoose";

export interface IChallan extends Document {
    client: string,
    challanNumber: string,
    totalMeters: number,
    quality: string,
    width: number,
    challanDate: Date,
    pcs: number,
    fold: number,
    rate: number,
    challanAmount: number
    // Add other fields as necessary
}

const ChallanSchema: Schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to Client
    challanNumber: String,
    totalMeters: Number,
    quality: String,
    width: Number,
    challanDate: Date,
    pcs: Number,
    fold: Number,
    rate: Number,
    challanAmount: Number
    // Add other fields as necessary
});

const ChallanModel = mongoose.models.Challan || mongoose.model<IChallan>('Challan', ChallanSchema);

export default ChallanModel;
