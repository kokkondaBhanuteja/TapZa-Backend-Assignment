import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import Pharmacy, { IPharmacy } from "@/models/pharmacyModel";

interface SoldMedicine{
    medicineId: number,
    purchasedMedicine: string,
    medicinePrice: number,
    purchasedQuantity: number,
    purchaseCost:number,
}
interface PurchaseItem{
    medicineName: number,
    customerNeed: number,
}
interface RequestBody{
    purchaseList:PurchaseItem[];
}

export async function POST(request:NextRequest) {
    try {
        await connectDb();
        const { purchaseList }:RequestBody = await request.json();
        let totalBillAmount = 0;
        const soldMedicines:SoldMedicine[]= [];
        for (const { medicineName, customerNeed } of purchaseList) {

            if (!medicineName || !customerNeed || customerNeed <= 0) {
                return NextResponse.json(
                {
                    error: `A Valid Mecdicine Id and Stock Quantity are Required for ID = ${medicineName}`,
                },
                { status: 400 }
                );
            }

            const medicineItem = await Pharmacy.findOne({ medicineName });
            if (!medicineItem) {
                return NextResponse.json(
                { error: `The Medicine with ID: ${medicineName} is not Found.` },
                { status: 404 }
                );
            }

            const presentStock = medicineItem.medicineStock;
            if (presentStock < customerNeed) {
                return NextResponse.json({
                    error: `The Medicine Stock is Insufficient, present Stock is = ${presentStock}`,
                    available: presentStock,
                    requested: customerNeed
                },
                { status: 400 }
                );
            }
            
        }

        for(const {medicineName, customerNeed} of purchaseList){
            const medicineItem = await Pharmacy.findOne({ medicineName }) as IPharmacy ;
            const purchaseCost = medicineItem.medicinePrice * customerNeed;
            totalBillAmount += purchaseCost;

            medicineItem.medicineStock -= customerNeed;

            await medicineItem.save();

            soldMedicines.push({
                medicineId:medicineItem.medicineId,
                purchasedMedicine: medicineItem.medicineName,
                medicinePrice: medicineItem.medicinePrice,
                purchasedQuantity: customerNeed,
                purchaseCost:purchaseCost,
            });
        }

        return NextResponse.json(
        {
            success:true,
            medicines: soldMedicines,
            totalBillAmount: totalBillAmount
        },
        { status: 200 }
        );
    } catch (err) {
        let message:string = "Couldn't complete the Sell Operation";
        if(err instanceof Error){
            message += `, ${err}`;
        }
        return NextResponse.json(
        { error: `, ${message}` },
        { status: 500 }
        );
    }
}
