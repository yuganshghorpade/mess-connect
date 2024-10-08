import dbConnect from "@/lib/dbConnect";
import Rating from "@/model/ratings.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// export async function GET(request) {
//     await dbConnect();
//     try {
//         const url = new URL(request.url);
//         const queryParams = new URLSearchParams(url.search);
//         const messId = queryParams.get("messId");

//         // const messRatings = await Rating.aggregate([
//         //     {
//         //         $match: {
//         //             mess: new mongoose.Types.ObjectId(messId), // Match ratings for the specific mess
//         //         },
//         //     },
//         //     {
//         //         $group: {
//         //             _id: "$mess", // Group by mess
//         //             avgCleanliness: { $avg: "$cleanliness" }, // Average of cleanliness ratings
//         //             avgFoodQuality: { $avg: "$foodQuality" }, // Average of food quality ratings
//         //             avgOwnerBehaviour: { $avg: "$ownerBehaviour" }, // Average of owner behaviour ratings
//         //             avgDeliveryPunctuality: { $avg: "$deliveryPunctuality" }, // Average of delivery punctuality ratings
//         //             avgVariety: { $avg: "$variety" }, // Average of variety ratings
//         //             overallAverage: {
//         //                 $avg: [
//         //                     "$cleanliness",
//         //                     "$foodQuality",
//         //                     "$ownerBehaviour",
//         //                     "$deliveryPunctuality",
//         //                     "$variety",
//         //                 ], // Calculate the overall average by averaging the individual ratings
//         //             },
//         //         },
//         //     },
//         // ]);

//         const messRatings = await Rating.aggregate([
//             {
//                 $match: {
//                     mess: new mongoose.Types.ObjectId(messId), // Match ratings for the specific mess
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$mess", // Group by mess
//                     avgCleanliness: { $avg: "$cleanliness" }, // Average of cleanliness ratings
//                     avgFoodQuality: { $avg: "$foodQuality" }, // Average of food quality ratings
//                     avgOwnerBehaviour: { $avg: "$ownerBehaviour" }, // Average of owner behaviour ratings
//                     avgDeliveryPunctuality: { $avg: "$deliveryPunctuality" }, // Average of delivery punctuality ratings
//                     avgVariety: { $avg: "$variety" }, // Average of variety ratings
//                     overallAverage: {
//                         $avg: [
//                             "$cleanliness",
//                             "$foodQuality",
//                             "$ownerBehaviour",
//                             "$deliveryPunctuality",
//                             "$variety",
//                         ], // Calculate the overall average
//                     },
//                 },
//             },
//         ]);

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Mess ratings fetched successfully",
//                 messRatings
//             },
//             {
//                 status: 200,
//             }
//         );
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `Some error occurred while fetching mess ratings. Error: ${error.message}`,
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }

// Function to get average ratings and overall average for a specific mess
export async function GET(request) {
    try {
        await dbConnect();

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const messId = queryParams.get("messId");

        const result = await Rating.aggregate([
            // Step 1: Filter for the specific mess
            {
                $match: { mess: new mongoose.Types.ObjectId(messId) },
            },
            // Step 2: Group the ratings and calculate averages for each category
            {
                $group: {
                    _id: "$mess", // Group by mess id
                    avgCleanliness: { $avg: "$cleanliness" },
                    avgFoodQuality: { $avg: "$foodQuality" },
                    avgOwnerBehaviour: { $avg: "$ownerBehaviour" },
                    avgDeliveryPunctuality: { $avg: "$deliveryPunctuality" },
                    avgVariety: { $avg: "$variety" },
                    // Calculate the overall average of these averages
                    overallAverage: {
                        $avg: {
                            $avg: [
                                "$cleanliness",
                                "$foodQuality",
                                "$ownerBehaviour",
                                "$deliveryPunctuality",
                                "$variety",
                            ],
                        },
                    },
                },
            },
        ]);
        console.log('result', result)

        // Check if result exists
        if (result) {
            return NextResponse.json (
                {
                    success: true,
                    message: "REviews fetched successfully",
                    response: result,
                },
                {
                    status: 200,
                }
            ); // Return the aggregated data
        } else {
            return NextResponse.json(
                {
                    success: true,
                    message: "No ratings found for this mess",
                },
                {
                    status: 404,
                }
            ); // If no ratings found for the mess
        }
    } catch (err) {
        return NextResponse(
            {
                success: false,
                message: `Some error occured while fetching rating.Error:-${err}`,
            },
            {
                status: 500,
            }
        );
    }
}
