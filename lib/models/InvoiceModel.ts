import mongoose, { Schema } from "mongoose";
import { number } from "yup";
import { IClient } from "./ClientModel";

export interface IInvoice extends Document {
    invoiceNumber: number,
    challan: any,
    invoiceDate: Date,
    paymentTerms: string,
    goodsSerialNumber: number,
    goodsDescription: string,
    goodsQuantity: number,
    goodsRate: number,
    goodsAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    roundOff: number,
    totalAmount: number,
    totalAmountInWords: string,
    cgstRate: number,
    sgstRate: number,
    totalTaxAmount: number,
    totalTaxAmountInWords: string,
    client: string;
    // Add other fields as necessary
}

const InvoiceSchema: Schema = new Schema({
    invoiceNumber: Number,
    challan: [{ type: Schema.Types.ObjectId, ref: 'Challan' }], // Array of ObjectId references to Challan
    invoiceDate: Date,
    paymentTerms: String,
    goodsSerialNumber: Number,
    goodsDescription: String,
    goodsQuantity: Number,
    goodsRate: Number,
    goodsAmount: Number,
    cgstAmount: Number,
    sgstAmount: Number,
    roundOff: Number,
    totalAmount: Number,
    totalAmountInWords: String,
    cgstRate: Number,
    sgstRate: Number,
    totalTaxAmount: Number,
    totalTaxAmountInWords: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to Client
    // Add other fields as necessary
});

const InvoiceModel = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default InvoiceModel;
