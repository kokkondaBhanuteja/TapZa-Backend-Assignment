import { connectDb } from "@/lib/connectDb";
import Pharmacy from "@/models/pharmacyModel";
import { NextResponse, NextRequest } from "next/server";

interface Params{
  id: string,
}
export async function GET(_:NextRequest,{ params }: { params: Promise<Params>} ) {
  try {
    await connectDb();
    const { id } = await  params;

    const pharmacyItem = await Pharmacy.findOne({ medicineId: Number(id) });

    if (!pharmacyItem) {
      return NextResponse.json(
        { message: `There is no Medicine with the Id = ${id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "The Medicine is = ",
        data:  pharmacyItem },
      { status: 200 }
    );
  } catch (err) {
    console.error("Couldno't get the Pharmacy Item, ", err);
    return NextResponse.json(
      { error: "Could not fetch the Pharmacy" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, 
  { params }: { params: Promise<Params> }) {
  try {
    await connectDb();
    
    const { id } =   await params;
    const medicineId:number = Number(id);
    if(!Number.isInteger(medicineId)){
      return NextResponse.json({
         error: "Invalid Medicine ID" }, { status: 400 }
      );
    }
    
    const body = await request.json();
  
    const { medicineName, medicinePrice, medicineStock } = body;
    
    if (!medicineId || !medicineName || !medicinePrice || !medicineStock) {
      return NextResponse.json(
        { error: "Please Enter all the Details" },
        { status: 404 }
      );
    }

    const updatedItem = await Pharmacy.findOneAndUpdate(
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
    console.error("Couldno't Update the Pharmacy Item, ", err);
    return NextResponse.json(
      { error: "Could not Update the Pharmacy " },
      { status: 500 }
    );
  }
}

export async function DELETE(_:NextRequest, { params }: { params: Promise<Params>}) {
  try {
    await connectDb();
    const { id } =  await params;
    const medicineId = Number(id);

    if(!medicineId){
      return NextResponse.json(
        { message: `The ID is not Correct = ${id}` },
        { status: 500 }
      );
    }

    const pharmacyItem = await Pharmacy.findOneAndDelete({ medicineId });

    if (!pharmacyItem) {
      return NextResponse.json(
        { message: `There is no Medicine with the Id = ${medicineId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "The Medicine is Successfully Deleted From the Pharmacy "},
      { status: 200 }
    );
  } 

  catch (err) {
    console.error("Couldno't Delete the Pharmacy Item, ", err);
    return NextResponse.json(
      { error: "Could not perform the deletion from the Pharmacy" },
      { status: 500 }
    );
  }
}
