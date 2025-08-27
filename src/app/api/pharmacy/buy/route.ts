import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Pharmacy from "@/models/pharmacyModel";

import { purchaseFromInventory } from "@/lib/inventoryService";
import { logPharmacyPurchase } from "@/lib/loggingService";

interface PurchaseItem{
  medicineId: number,
  stockNeed: number,
}
interface RequestBody{
  purchaseList:PurchaseItem[];
}
export async function POST(request:NextRequest) {
  await connectDb();
  try {
    const purchaseList:RequestBody = await request.json();

    if (!purchaseList || !Array.isArray(purchaseList) || purchaseList.length === 0)
    {
      return NextResponse.json(
        { error: "Atleast one MedicalId and one Stock Quantiity is needed." },
        { status: 400 }
      );
    }

    

    const inventoryPurchaseResponse = await purchaseFromInventory(purchaseList);

    if (!inventoryPurchaseResponse.success || ! inventoryPurchaseResponse.medicines) {
      return NextResponse.json(
        { error: inventoryPurchaseResponse.error },
        { status: inventoryPurchaseResponse.status }
      );
    }
    
      for(const medicine of inventoryPurchaseResponse.medicines){
        const medicineExist = await Pharmacy.findOne({medicineId: medicine.medicineId});
        
        if(medicineExist){
          medicineExist.medicineStock += medicine.purchasedQuantity;
          await medicineExist.save();
        }
        else{
          await Pharmacy.create({
            medicineId: medicine.medicineId,
            medicineName: medicine.purchasedMedicine,
            medicinePrice:medicine.medicinePrice,
            medicineStock:medicine.purchasedQuantity,  
          });
        }
      }

      const logResponse = await logPharmacyPurchase(inventoryPurchaseResponse.medicines, inventoryPurchaseResponse.totalBillAmount || 0)

      if (!logResponse.success) {
        return NextResponse.json({
            message: "Medicines were successfully purchased, but failed to record the log.",
            purchaseDetails: logResponse,
            logError: logResponse.error
        }, { status: 207 }); 
    }
      return NextResponse.json(
        {message:`Medicines are Successfully Purchased and Recorded : ${logResponse.log}`},
        {status: logResponse.status}
      );
  } catch (err) {
    console.error("Error While Buying the Medicine ", err);
    return NextResponse.json(
      { error: "Error While Buying the Medicine from the Inventory" },
      { status: 500 }
    );
  }
}
