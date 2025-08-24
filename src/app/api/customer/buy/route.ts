import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/customerModel"

const PHARMACY_API = "http://localhost:3000/api/pharmacy";
const CUSTOMER_LOG_API =  "http://localhost:3000/api/customer-log" ;

interface PurchaseItem{
  medicineName: string,
  customerNeed: number,
}

interface RequestBody{
  customerId:number,
  customerName:string,
  purchaseList:PurchaseItem[];
}

export async function POST(request:NextRequest) {
  await connectDb();
  try {
    const {customerId, customerName, purchaseList}:RequestBody = await request.json();

    if (!customerId|| !customerName ||!purchaseList || !Array.isArray(purchaseList) || purchaseList.length === 0)
    {
      return NextResponse.json(
        { error: "Atleast one MedicalId and one Stock Quantiity is needed, and Enter Correct CustomerId, customerName" },
        { status: 400 }
      );
    }
    let customer = await Customer.findOne({customerId});
    if(!customer){
        customer = await Customer.create({customerId, customerName});
    }

    const purchaseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseList }),
    };

    const customerPurchaseResponse = await fetch(`${PHARMACY_API}/sell`,purchaseOptions);

    const result = await customerPurchaseResponse.json();

    if (!customerPurchaseResponse.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: customerPurchaseResponse.status }
      );
    }
    if(result.success){

      const logOptions = {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body:JSON.stringify({
            customerId: customerId,
            medicines: result.medicines,
            totalBillAmount: result.totalBillAmount,
        })
      }
      const logResponse = await fetch(CUSTOMER_LOG_API, logOptions);
      
      const logResult = await logResponse.json();
      if(!logResponse.ok){
        return NextResponse.json(
            {
                message: " Purchase was Successful, bur logging has Failed",
                logError: logResult.error,
            },
            {status: 500}
        ) 
      }
      
      return NextResponse.json(
        {
            message:`Medicines are Successfully Purchased and Recorded`,
            logDetails: logResult,
            purchaseDetails: result
        },
        {status: logResponse.status}
      );
    }
  } catch (err) {
    console.error("Error While Buying the Medicine ", err);
    return NextResponse.json(
      { error: "Error While Buying the Medicine from the Pharmacy" },
      { status: 500 }
    );
  }
}
