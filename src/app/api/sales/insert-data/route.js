import SalesAnalysis from "@/model/salesanalysis.model";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
    try {
        await dbConnect();
        const { id, type } = await getDataFromToken(request);
        const { sales, note,name } = await request.json(); // Expecting { sales: [...], note: "..." }

        if (type === "user") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bad Request",
                },
                {
                    status: 400,
                }
            );
        }

        // Validate that sales is an array with at least one entry
        if (!Array.isArray(sales) || sales.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Sales data must be an array with at least one entry",
                },
                {
                    status: 400,
                }
            );
        }

        // Validate each sale entry
        for (const sale of sales) {
            if (!sale.price || !sale.quantity || !sale.menu) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Each sale entry must have price, quantity, and menu",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        // Insert sales data into the database
        const salesData = await SalesAnalysis.create({
            mess: id,
            name,
            sales: sales, // Save all sales as an array inside a single document
            note,
            date: new Date(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Sales Data Inserted Successfully",
                data: salesData,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Some error occurred while inserting Sales Data. Error: ${error}`,
            },
            {
                status: 500,
            }
        );
    }
}
