import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";
import SalesAnalysis from "@/model/salesanalysis.model";

export async function GET(request) {
    try {
        await dbConnect();

        const { id, type } = await getDataFromToken(request);
        if (type !== "mess") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bad Request. You are not authorized to fetch sales data.",
                },
                {
                    status: 400,
                }
            );
        }

        const salesData = await SalesAnalysis.find({ mess: id }).sort({
            createdAt: 1
        });


        if (!salesData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No Sales Data Found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Sales Data Fetched Successfully",
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
                message: `Some error occurred while fetching Sales Data. Error: ${error}`,
            },
            {
                status: 500,
            }
        );
    }
}
