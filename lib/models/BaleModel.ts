import mongoose, { Schema } from "mongoose";

export interface IBale extends Document {
    challan: string,
    baleCount: number,
    totalMeters: number,
    // Add other fields as necessary
}

const BaleSchema: Schema = new Schema({

    challan: { type: Schema.Types.ObjectId, ref: 'Challan', required: true }, // Reference to Client
    baleCount: Number,
    totalMeters: Number,

    // Add other fields as necessary
});

const BaleModel = mongoose.models.Bale || mongoose.model<IBale>('Bale', BaleSchema);

export default BaleModel;
