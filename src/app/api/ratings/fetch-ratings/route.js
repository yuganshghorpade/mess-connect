import dbConnect from "@/lib/dbConnect";
import Rating from "@/model/ratings.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();
    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const messId = queryParams.get("messId");

        const messRatings = await Rating.aggregate([
            {
                $match: {
                    mess: new  mongoose.Types.ObjectId(messId), // Match ratings for the specific mess
                },
            },
            {
                $group: {
                    _id: "$mess", // Group by mess
                    avgCleanliness: { $avg: "$cleanliness" }, // Average of cleanliness ratings
                    avgFoodQuality: { $avg: "$foodQuality" }, // Average of food quality ratings
                    avgOwnerBehaviour: { $avg: "$ownerBehaviour" }, // Average of owner behaviour ratings
                    avgDeliveryPunctuality: { $avg: "$deliveryPunctuality" }, // Average of delivery punctuality ratings
                    avgVariety: { $avg: "$variety" }, // Average of variety ratings
                    overallAverage: {
                        $avg: {
                            $avg: [
                                "$cleanliness",
                                "$foodQuality",
                                "$ownerBehaviour",
                                "$deliveryPunctuality",
                                "$variety",
                            ], // Calculate the overall average by averaging the individual ratings
                        },
                    },
                },
            },
        ]);

        return NextResponse.json(
            {
                success: true,
                message: "Mess ratings fetched successfully",
                messRatings
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                success: false,
                message: `Some error occured while fetching mess ratings.Error:-${error}`,
                
            },
            { 
                status: 500,
            }
        );
    }
}
