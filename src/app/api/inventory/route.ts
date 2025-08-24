import { connectDb } from "@/lib/connectDb";
import Inventory from "@/models/inventoryModel";

export async function GET() {
  await connectDb();
  const inventoryItems = await Inventory.find();

  console.log("All Inventory Items are = \n", inventoryItems);
  if (inventoryItems.length > 0) {
    return Response.json(
      inventoryItems.map(item => ({
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        medicinePrice: item.medicinePrice,
        medicineStock: item.medicineStock
      }))
    );
  }
  return Response.json(
    { error: "You Inventory is Currently Empty!" },
    { status: 404 }
  );
}
