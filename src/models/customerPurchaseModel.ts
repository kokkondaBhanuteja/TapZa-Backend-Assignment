import mongoose, { Document, Schema, Model } from "mongoose";

interface ICustomerMedicine extends Document {
  medicineId: number;
  purchasedMedicine: string;
  purchasedQuantity: number;
  purchaseCost: number;
}

const CustomerMedicineSchema: Schema<ICustomerMedicine> = new mongoose.Schema({
  medicineId: {
    type: Number,
    required: true,
  },
  purchasedMedicine: {
    type: String,
    required: true,
  },
  purchasedQuantity: {
    type: Number,
    min: 1,
    required: true,
  },
  purchaseCost: {
    type: Number,
    required: true,
  },
});

export interface ICustomerPurchase extends Document {
  customerId: number;
  medicines: ICustomerMedicine[];
  totalBillAmount: number;
  purchaseDate: Date;
}

const CustomerPurchaseSchema: Schema<ICustomerPurchase> = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
  },
  medicines: [CustomerMedicineSchema],
  totalBillAmount: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const CustomerPurchase: Model<ICustomerPurchase> =
  mongoose.models.CustomerPurchase ||
  mongoose.model<ICustomerPurchase>(
    "CustomerPurchase",
    CustomerPurchaseSchema
  );

export default CustomerPurchase;