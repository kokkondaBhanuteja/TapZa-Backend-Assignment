import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IInventory extends Document {
  _id: Types.ObjectId,
  medicineId: number;
  medicineName: string;
  medicinePrice: number;
  medicineStock: number;
}

const InventorySchema: Schema<IInventory> = new mongoose.Schema(
  {
    medicineId: {
      type: Number,
      required: true,
      unique: true,
    },
    medicineName: {
      type: String,
      trim: true,
      required: true,
    },
    medicinePrice: {
      type: Number,
      min: 0,
      required: true,
    },
    medicineStock: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory: Model<IInventory> =
  mongoose.models.Inventory ||
  mongoose.model<IInventory>("Inventory", InventorySchema);

export default Inventory;