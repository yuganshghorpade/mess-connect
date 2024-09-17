import dbConnect from "@/lib/dbConnect";
import Rating from "@/model/ratings.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request) {
    dbConnect();
    try {
        const {
            cleanliness,
            foodQuality,
            ownerBehaviour,
            deliveryPunctuality,
            variety,
            review,
        } = await request.json();

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const messId = queryParams.get("messId");

        const { userId, type } = getDataFromToken();
        if (type == "mess") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot rate other messes...",
                },
                {
                    status: 400,
                }
            );
        }
        const rating = await Rating.create({
            user:userId,
            mess:messId,
            cleanliness,
            foodQuality,
            ownerBehaviour,
            deliveryPunctuality,
            variety,
            review,
        })

        return NextResponse.json(
            {
                success: true,
                message: "Rating submitted successfully",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Some error occured while rating mess.Error:-${error}`,
            },
            {
                status: 500,
            }
        );
    }
}
