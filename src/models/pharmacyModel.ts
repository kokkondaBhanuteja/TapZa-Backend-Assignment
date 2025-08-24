import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPharmacy extends Document {
  medicineId: number;
  medicineName: string;
  medicinePrice: number;
  medicineStock: number;
}

const PharmacySchema: Schema<IPharmacy> = new mongoose.Schema({
  medicineId: {
    type: Number,
    unique: true,
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  medicinePrice: {
    type: Number,
    required: true,
  },
  medicineStock: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Pharmacy: Model<IPharmacy> =
  mongoose.models.Pharmacy ||
  mongoose.model<IPharmacy>("Pharmacy", PharmacySchema);

export default Pharmacy;