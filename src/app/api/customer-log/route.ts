import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import CustomerPurchase from "@/models/customerPurchaseModel";

interface MedicineItem{
    medicineId: number,
    purchasedMedicine: string,
    medicinePrice: number,
    purchasedQuantity: number,
    purchaseCost:number,
}
interface RequestBody{
    customerId: number,
    medicines:MedicineItem[],
    totalBillAmount:number,
}
export async function POST(request:NextRequest) {
    try{
        await connectDb();
        const body:RequestBody = await request.json();
        
        const {customerId, medicines, totalBillAmount } = body;
        if(!customerId || !medicines || !totalBillAmount){
            return NextResponse.json(
                {erorr: "Missing Details of CustomerID and medicines and BillAmount"},
                {status: 400}
            )
        } 
        const newLog = await CustomerPurchase.create({
            customerId,
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
        console.error("Error While Recording the Customer LoG ", err);
        return NextResponse.json(
          { error: "Error While Logging the Medicine from the Customer" },
          { status: 500 }
        );
    }
    
}