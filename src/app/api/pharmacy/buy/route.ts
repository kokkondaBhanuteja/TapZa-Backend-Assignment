import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Pharmacy from "@/models/pharmacyModel";

const INVENTORY_API = process.env.MEDICINE_PURCHASE_URL || "http://localhost:3000/api/inventory";
const LOG_PURCHASE_API = process.env.PHARMACY_PURCHASELOG_URL || "http://localhost:3000/api/log-purchase" ;

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

    const purchaseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseList }),
    };

    const inventoryPurchaseResponse = await fetch(`${INVENTORY_API}/purchase`,purchaseOptions);

    const result = await inventoryPurchaseResponse.json();

    if (!inventoryPurchaseResponse.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: inventoryPurchaseResponse.status }
      );
    }
    if(result.success){
      for(const medicine of result.medicines){
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

      const logOptions = {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body:JSON.stringify({
          medicines: result.medicines,
          totalBillAmount: result.totalBillAmount,
        })
      }
      const logResponse = await fetch(LOG_PURCHASE_API, logOptions);
      
      const logResult = await logResponse.json();
      
      return NextResponse.json(
        {message:`Medicines are Successfully Purchased and Recorded : ${logResult.medicines}`},
        {status: logResponse.status}
      );
    }
  } catch (err) {
    console.error("Error While Buying the Medicine ", err);
    return NextResponse.json(
      { error: "Error While Buying the Medicine from the Inventory" },
      { status: 500 }
    );
  }
}
