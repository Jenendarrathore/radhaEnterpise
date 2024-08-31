import mongoose, { Schema } from "mongoose";

export interface IBaleEntry extends Document {

    bale: number,
    meters: number,
    // Add other fields as necessary
}

const BaleEntrySchema: Schema = new Schema({

    bale: { type: Schema.Types.ObjectId, ref: 'Bale', required: true }, // Reference to Client
    meters: Number,

    // Add other fields as necessary
});

const BaleEntryModel = mongoose.models.BaleEntry || mongoose.model<IBaleEntry>('BaleEntry', BaleEntrySchema);

export default BaleEntryModel;
