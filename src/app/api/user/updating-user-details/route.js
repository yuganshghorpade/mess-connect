import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import User from "@/model/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function PATCH(request) {
    try {
        await dbConnect();

        const { longitude, latitude } = await request.json();

        console.log('longitude', longitude)
        console.log('latitude', latitude)

        if (!(longitude || latitude)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Field to be updated not found",
                },
                { status: 404 }
            );
        }

        const { id, type } = await getDataFromToken(request);

        console.log(id);

        let user;
        if (type === "user") {
            user = await User.findById(id).select("-password -refreshToken");
        } else if (type === "mess") {
            user = await Mess.findById(id).select("-password -refreshToken");
        }

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        user.location = {
            type: 'Point',
            coordinates: [latitude, longitude], // Longitude first, then latitude
          };
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "User location updated",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating user details:", error);
        return NextResponse.json(
            {
                success: false,
                message: `Some error occurred while updating user details. Error: ${error.message}`,
            },
            { status: 500 }
        );
    }
}
