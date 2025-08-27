
import PharmacyPurchase,{IPharmacyPurchase} from "@/models/pharmacyPurchaseModel";
import CustomerPurchase, {ICustomerPurchase} from "@/models/customerPurchaseModel";
import { ISoldMedicine } from "./pharmacyService";


interface IPurchaseMedicine {
  inventoryId: string;
  medicineId: number;
  medicinePrice: number;
  purchasedMedicine: string;
  purchasedQuantity: number;
  purchaseCost: number;
}

export async function logPharmacyPurchase(
  medicines: IPurchaseMedicine[],
  totalBillAmount: number
): Promise<{ success: boolean; log?: IPharmacyPurchase; error?: string, status: number }> {
  try {
    if (!medicines || !totalBillAmount) {
      return {
        success: false,
        error: "Missing details of medicines and BillAmount for logging.",
        status: 404,
      };
    }

    const newLog = await PharmacyPurchase.create({
      medicines,
      totalBillAmount,
    });

    return {
      success: true,
      log: newLog,
      status: 201,
    };
  } catch (err) {
    console.error("Error While Recording the Medicine Log: ", err);
    return {
      success: false,
      error: "Error While Logging the Medicine from the Inventory",
      status:500,
    };
  }
}

export async function logCustomerPurchase(
  customerId: number,
  medicines: ISoldMedicine[],
  totalBillAmount: number
): Promise<{ success: boolean; log?: ICustomerPurchase; error?: string}> {
  try {
      if(!customerId || !medicines || typeof totalBillAmount !== 'number') {
          return {
              success: false,
              error: "Missing customerId, medicines, or valid totalBillAmount for logging."
          }
      }

      const newLog = await CustomerPurchase.create({
          customerId,
          medicines,
          totalBillAmount
      });

      return { success: true, log: newLog };

  } catch (err) {
      console.error("Error While Recording the Customer Log: ", err);
      return {
        success: false,
        error: "Error While Logging the Customer Purchase",
      };
  }
}
