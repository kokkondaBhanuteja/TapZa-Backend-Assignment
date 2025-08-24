import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface IPurchasedMedicine extends Document {
  inventoryId: Types.ObjectId;
  purchasedMedicine: string;
  purchasedQuantity: number;
  purchaseCost: number;
}

const PurchasedMedicineSchema: Schema<IPurchasedMedicine> =
  new mongoose.Schema({
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
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

export interface IPharmacyPurchase extends Document {
  medicines: IPurchasedMedicine[];
  totalBillAmount: number;
  purchaseDate: Date;
}

const PharmacyPurchaseSchema: Schema<IPharmacyPurchase> = new mongoose.Schema({
  medicines: [PurchasedMedicineSchema],
  totalBillAmount: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const PharmacyPurchase: Model<IPharmacyPurchase> =
  mongoose.models.PharmacyPurchase ||
  mongoose.model<IPharmacyPurchase>(
    "PharmacyPurchase",
    PharmacyPurchaseSchema
  );

export default PharmacyPurchase;