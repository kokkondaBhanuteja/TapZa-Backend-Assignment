import Inventory,{IInventory} from "@/models/inventoryModel";

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

export async function purchaseFromInventory(purchaseList: PurchaseItem[]):Promise<{
    success:boolean
    medicines?:IPurchaseMedicine[],
    totalBillAmount?:number,
    error?:string,
    status:number
}>{
    try{
        let totalBillAmount = 0;
        const purchasedMedicines: IPurchaseMedicine[] = [];

    
    for (const { medicineId, stockNeed } of purchaseList) {
      if (!medicineId || !stockNeed || stockNeed <= 0) {
        return {
          success: false,
          error: `A valid Medicine ID and stock quantity are required for ID = ${medicineId}`,
          status: 400,
        };
      }

      const inventoryItem = await Inventory.findOne({ medicineId });
      if (!inventoryItem) {
        return {
          success: false,
          error: `The Medicine with ID: ${medicineId} is not found.`,
          status: 404,
        };
      }

      if (inventoryItem.medicineStock < stockNeed) {
        return {
          success: false,
          error: `The Medicine stock is insufficient for ${inventoryItem.medicineName}. Available: ${inventoryItem.medicineStock}, Requested: ${stockNeed}`,
          status: 400,
        };
      }
    }

    
    for (const { medicineId, stockNeed } of purchaseList) {
      const inventoryItem = (await Inventory.findOne({ medicineId })) as IInventory; // We know it exists from the check above

      const purchaseCost = inventoryItem.medicinePrice * stockNeed;
      totalBillAmount += purchaseCost;

      inventoryItem.medicineStock -= stockNeed;
      await inventoryItem.save();

      purchasedMedicines.push({
        inventoryId: inventoryItem._id.toString(),
        medicineId: inventoryItem.medicineId,
        medicinePrice: inventoryItem.medicinePrice,
        purchasedMedicine: inventoryItem.medicineName,
        purchasedQuantity: stockNeed,
        purchaseCost: purchaseCost,
      });
    }

    return {
      success: true,
      medicines: purchasedMedicines,
      totalBillAmount: totalBillAmount,
      status: 200
    };

    }catch(err:unknown){
        console.error("Error in purchaseFromInventory service: ", err);
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        return {
          success: false,
          error: `Couldn't complete the purchase operation: ${message}`,
          status: 500,
        };        
    }
} 