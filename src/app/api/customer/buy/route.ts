import { connectDb } from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Customer from "@/models/customerModel";

import { sellToCustomer } from "@/lib/pharmacyService";
import { logCustomerPurchase } from "@/lib/loggingService";

interface PurchaseItem {
  medicineName: string;
  customerNeed: number;
}

interface RequestBody {
  customerId: number;
  customerName: string;
  purchaseList: PurchaseItem[];
}

export async function POST(request: NextRequest) {
  await connectDb();
  try {
    const { customerId, customerName, purchaseList }: RequestBody =
      await request.json();

    if (!customerId || !customerName || !purchaseList || !Array.isArray(purchaseList) ||
      purchaseList.length === 0 ) {
      return NextResponse.json(
        {
          error:
            "Atleast one MedicalId and one Stock Quantiity is needed, and Enter Correct CustomerId, customerName",
        },
        { status: 400 }
      );
    }
    
    let customer = await Customer.findOne({ customerId });
    if (!customer) {
      customer = await Customer.create({ customerId, customerName });
    }

    const sellResult = await sellToCustomer(purchaseList);

    if (!sellResult.success || !sellResult.medicines) {
      return NextResponse.json(
        { error: sellResult.error },
        { status: sellResult.status || 500 }
      );
    }

    const logResult = await logCustomerPurchase(customerId, sellResult.medicines, sellResult.totalBillAmount || 0);


    if (!logResult.success) {
      return NextResponse.json(
        {
          message: " Purchase was Successful, bur logging has Failed",
          error: logResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Medicines are Successfully Purchased and Recorded`,
        logDetails: logResult.log,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error While Buying the Medicine ", err);
    return NextResponse.json(
      { error: "Error While Buying the Medicine from the Pharmacy" },
      { status: 500 }
    );
  }
}
