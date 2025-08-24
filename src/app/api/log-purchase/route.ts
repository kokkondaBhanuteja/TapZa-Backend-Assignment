import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import PharmacyPurchase from "@/models/pharmacyPurchaseModel";

interface RequestBody{
    medicines:IPurchaseMedicine[],
    totalBillAmount:number,
}
interface IPurchaseMedicine{
    inventoryId:string,
    medicineId: number,
    medicinePrice: number,
    purchasedMedicine: string,
    purchasedQuantity: number,
    purchaseCost:number,
}

export async function POST(request:NextRequest) {
    try{
        await connectDb();
        const body:RequestBody = await request.json();
        
        const { medicines, totalBillAmount } = body;
        if(!medicines || !totalBillAmount){
            return NextResponse.json(
                {erorr: "Missing Details of medicines and BillAmount"},
                {status: 400}
            )
        } 
        const newLog = await PharmacyPurchase.create({
            medicines,
            totalBillAmount,
        })
        return NextResponse.json(
            {
                message :"Purchase Successfully Recorded",
                log: newLog,
            },
            {status: 201}
        );
    }catch(err){
        console.error("Error While Recording the Medicine ", err);
        return NextResponse.json(
          { error: "Error While Logging the Medicine from the Inventory" },
          { status: 500 }
        );
    }
    
}