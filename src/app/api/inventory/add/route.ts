import { NextResponse, NextRequest } from "next/server";
import { connectDb } from "@/lib/connectDb";
import Inventory, { IInventory } from "@/models/inventoryModel";

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const body: IInventory = await request.json();
    const { medicineId, medicineName, medicinePrice, medicineStock } = body;

    if (!medicineId || !medicineName || !medicinePrice || !medicineStock) {
      return NextResponse.json(
        { error: "Please Enter all the Details" },
        { status: 404 }
      );
    }
    const idExist = await Inventory.findOne({ medicineId });
    if (idExist) {
      return NextResponse.json(
        { message: "Id already Exists, use Another" },
        { status: 400 }
      );
    }
    const newInventoryItem = await Inventory.create({
      medicineId,
      medicineName,
      medicinePrice,
      medicineStock,
    });

    return NextResponse.json(
      { message: "Data SuccessFully Inserted", newInventoryItem },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error While Creating the Inventory ", err);
    return NextResponse.json(
      { error: "Error While Inserting the Medicine into the Inventory" },
      { status: 500 }
    );
  }
}