import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import Pharmacy from "@/models/pharmacyModel";
interface Medicine{
  _id: string;
  medicineId: number;
  medicineName: string;
  medicinePrice: number;
  medicineStock: number;
}
export async function GET() {
  try {
    await connectDb();

    const pharmacyMedicines:Medicine[] = await Pharmacy.find();
    console.log("All Pharmacy Available Items are = ", pharmacyMedicines);

    if (pharmacyMedicines.length > 0) {
      return NextResponse.json({ pharmacyMedicines }, { status: 200 });
    }
    return NextResponse.json(
      { error: "Sorry, The Medicines are not Available " },
      { status: 404 }
    );
  } catch (err) {
    console.error("Error While Creating the Inventory ", err);
    return NextResponse.json(
      { error: "Error While Inserting the Medicine into the Inventory" },
      { status: 500 }
    );
  }
}
