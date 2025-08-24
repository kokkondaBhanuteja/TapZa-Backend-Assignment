import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICustomer extends Document {
  customerId: number;
  customerName: string;
}

const CustomerSchema: Schema<ICustomer> = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
});

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;