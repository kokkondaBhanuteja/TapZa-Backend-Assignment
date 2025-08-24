import { connectDb } from "@/lib/connectDb";
import Inventory from "@/models/inventoryModel";
import { NextRequest, NextResponse } from "next/server";

interface Params{
  id: string,
}
export async function GET(_:NextRequest, { params }: {params:Params}) {
  try {
    await connectDb();
    const { id } = await params;

    const InventoryItem = await Inventory.findOne({ medicineId: Number(id) });

    if (!InventoryItem) {
      return NextResponse.json(
        { message: `There is no Medicine with the Id = ${id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "The Medicine is = ", InventoryItem },
      { status: 200 }
    );
  } catch (err) {
    console.error("Couldno't get the Inventory Item, ", err);
    return NextResponse.json(
      { error: "Could not fetch the Inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(request:NextRequest, { params }:{params:Params}) {
  try {
    await connectDb();
    
    const { id } = await params;
    const medicineId = Number(id);
    if(!Number.isInteger(medicineId)){
    }
    
    const body = await request.json();
  
    const { medicineName, medicinePrice, medicineStock } = body;
    
    if (!medicineId || !medicineName || !medicinePrice || !medicineStock) {
      return NextResponse.json(
        { error: "Please Enter all the Details" },
        { status: 404 }
      );
    }

    const updatedItem = await Inventory.findOneAndUpdate(
      { medicineId },
      { $set: { medicineName, medicinePrice, medicineStock } },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { message: `There is no Medicine with the Id = ${medicineId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "The Updated Medicine is = ", updatedItem },
      { status: 200 }
    );
  } catch (err) {
    console.error("Couldno't Update the Inventory Item, ", err);
    return NextResponse.json(
      { error: "Could not Update the Inventory" },
      { status: 500 }
    );
  }
}

export async function DELETE(request:NextRequest, { params }:{params:Params}) {
  try {
    await connectDb();
    const { id } = await params;
    const medicineId = Number(id);

    if(!medicineId){
      return NextResponse.json(
        { message: `The ID is not Correct = ${id}` },
        { status: 500 }
      );
    }

    const InventoryItem = await Inventory.findOneAndDelete({ medicineId });

    if (!InventoryItem) {
      return NextResponse.json(
        { message: `There is no Medicine with the Id = ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "The Medicine is Successfully Deleted From the Inventory "},
      { status: 200 }
    );
  } 

  catch (err) {
    console.error("Couldno't Delete the Inventory Item, ", err);
    return NextResponse.json(
      { error: "Could not perform the deletion from the Inventory" },
      { status: 500 }
    );
  }
}
