import { NextResponse } from "next/server";

const GET_MEDICINES_API = "http://localhost:3000/api/pharmacy";
interface Medicine{
    _id: string;
    medicineId: number;
    medicineName: string;
    medicinePrice: number;
    medicineStock: number;
  }
export async function GET() {
    try{
        const options = {
            method:"GET",
            headers: {"Content-Type": "application/json"},
        }
        const response = await fetch(GET_MEDICINES_API, options);
        if(!response.ok){
            return NextResponse.json(
                {error:"Sorry For the Inconcvience, The Stock is Empty "},
                {status: 503} 
            )
        }
        const data:{pharmacyMedicines: Medicine[]} = await response.json();
        console.log(data);
        if(!data || !Array.isArray(data.pharmacyMedicines)){
            return NextResponse.json(
                {error:"Invalid Structure Received from the API"},
                {status: 500} 
            )
        }
        const customerView = data.pharmacyMedicines.map((medicine:Medicine) =>({
            name: medicine.medicineName,
            price: medicine.medicinePrice
        }));

        return NextResponse.json(
            {customerView},
            {status:200}
        )
    }catch(err){
        console.error("Error While Fetching Medicine ", err);
        return NextResponse.json(
          { error: "Error While Fetching the Mediciness" },
          { status: 500 }
        );
    }
}