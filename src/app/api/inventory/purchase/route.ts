import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import  Inventory, { IInventory }from "@/models/inventoryModel";

interface IPurchaseMedicine{
    inventoryId:string,
    medicineId: number,
    medicinePrice: number,
    purchasedMedicine: string,
    purchasedQuantity: number,
    purchaseCost:number,
}

interface PurchaseItem{
    medicineId: number,
    stockNeed: number,
}
interface RequestBody{
    purchaseList:PurchaseItem[];
}


export async function POST(request:NextRequest) {
    try {
        await connectDb();
        const { purchaseList }:RequestBody = await request.json();
        let totalBillAmount = 0;
        const purchasedMedicines: IPurchaseMedicine[] = [];
        for (const { medicineId, stockNeed } of purchaseList) {

            if (!medicineId || !stockNeed || stockNeed <= 0) {
                return NextResponse.json(
                {
                    error: `A Valid Mecdicine Id and Stock Quantity are Required for ID = ${medicineId}`,
                },
                { status: 400 }
                );
            }

            const inventoryItem = await Inventory.findOne({ medicineId }) as IInventory | null ;
            if (!inventoryItem) {
                return NextResponse.json(
                { error: `The Medicine Is with ID: ${medicineId} is not Found.` },
                { status: 404 }
                );
            }

            const presentStock:number = inventoryItem.medicineStock;
            if (presentStock < stockNeed) {
                return NextResponse.json({
                    error: `The Medicine Stock is Insufficient, present Stock is = ${presentStock}`,
                    available: presentStock,
                    requested: stockNeed
                },
                { status: 400 }
                );
            }
            
        }

        for(const {medicineId, stockNeed} of purchaseList){
            const inventoryItem = await Inventory.findOne({ medicineId }) as IInventory | null;
            if (!inventoryItem) {
                return NextResponse.json(
                { error: `The Medicine Is with ID: ${medicineId} is not Found.` },
                { status: 404 }
                );
            }
            const purchaseCost = inventoryItem.medicinePrice * stockNeed;
            totalBillAmount += purchaseCost;

            inventoryItem.medicineStock -= stockNeed    ;

            await inventoryItem.save();

            purchasedMedicines.push({
                inventoryId:inventoryItem._id.toString(),
                medicineId: inventoryItem.medicineId,
                medicinePrice: inventoryItem.medicinePrice,
                purchasedMedicine: inventoryItem.medicineName,
                purchasedQuantity: stockNeed,
                purchaseCost:purchaseCost,
            });
        }

        return NextResponse.json(
        {
            success:true,
            medicines: purchasedMedicines,
            totalBillAmount: totalBillAmount
        },
        { status: 200 }
        );
    } catch (err:unknown) {
        let message ="Couldn't complete the Purchase Operation";
        if(err instanceof Error){
            message += `, ${err}` 
        } 
        return NextResponse.json(
        { error: message },
        { status: 500 }
        );
    }
}
