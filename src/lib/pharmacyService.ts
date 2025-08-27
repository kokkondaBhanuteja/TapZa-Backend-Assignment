import Pharmacy, { IPharmacy } from "@/models/pharmacyModel";

export interface CustomerPurchaseItem {
  medicineName: string;
  customerNeed: number;
}

export interface ISoldMedicine {
  medicineId: number;
  purchasedMedicine: string;
  medicinePrice: number;
  purchasedQuantity: number;
  purchaseCost: number;
}

export async function sellToCustomer(purchaseList: CustomerPurchaseItem[]): Promise<{
  success: boolean;
  medicines?: ISoldMedicine[];
  totalBillAmount?: number;
  error?: string;
  status?: number;
}> {
  try {
    let totalBillAmount = 0;
    const soldMedicines: ISoldMedicine[] = [];

    for (const { medicineName, customerNeed } of purchaseList) {
      if (!medicineName || !customerNeed || customerNeed <= 0) {
        return {
          success: false,
          error: `A valid medicine name and quantity are required. Problem with: ${medicineName}`,
          status: 400,
        };
      }

      const medicineItem = await Pharmacy.findOne({ medicineName }) as IPharmacy;
      if (!medicineItem) {
        return {
          success: false,
          error: `The medicine '${medicineName}' was not found.`,
          status: 404,
        };
      }

      if (medicineItem.medicineStock < customerNeed) {
        return {
          success: false,
          error: `Insufficient stock for ${medicineName}. Available: ${medicineItem.medicineStock}, Requested: ${customerNeed}`,
          status: 400,
        };
      }
    }

    for (const { medicineName, customerNeed } of purchaseList) {
      const medicineItem = (await Pharmacy.findOne({medicineName})) as IPharmacy;
      const purchaseCost = medicineItem.medicinePrice * customerNeed;
      totalBillAmount += purchaseCost;

      medicineItem.medicineStock -= customerNeed;
      await medicineItem.save();

      soldMedicines.push({
        medicineId: medicineItem.medicineId,
        purchasedMedicine: medicineItem.medicineName,
        medicinePrice: medicineItem.medicinePrice,
        purchasedQuantity: customerNeed,
        purchaseCost: purchaseCost,
      });
    }

    return {
      success: true,
      medicines: soldMedicines,
      totalBillAmount: totalBillAmount,
    };
  } catch (err) {
    console.error("Error in sellToCustomer service: ", err);
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return {
      success: false,
      error: `Couldn't complete the sell operation: ${message}`,
      status: 500,
    };
  }
}
