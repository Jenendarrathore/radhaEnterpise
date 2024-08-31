import mongoose, { Schema } from "mongoose";

export interface IClient extends Document {
    partyName: string,
    address: string,
    gst: string,
    panNo: string,
    state: string,
    code: string,
    // Add other fields as necessary
}

const ClientSchema: Schema = new Schema({
    partyName: String,
    address: String,
    gst: String,
    panNo: String,
    state: String,
    code: String,

    // Add other fields as necessary
});

const ClientModel = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default ClientModel;
