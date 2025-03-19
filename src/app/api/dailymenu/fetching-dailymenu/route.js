import dbConnect from "@/lib/dbConnect";
import Dailymenu from "@/model/dailymenu.model";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const longitude = parseFloat(searchParams.get('longitude'));
        const latitude = parseFloat(searchParams.get('latitude'));

        if (!longitude || !latitude) {
            return NextResponse.json({
                success: false,
                message: "Longitude and latitude are required",
            }, { status: 400 });
        }

        const userCoordinates = [longitude, latitude];

        // Perform geoNear aggregation to get messes sorted by distance
        const messes = await Mess.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: userCoordinates },
                    distanceField: "distance",
                    spherical: true,
                },
            },
        ]);

        if (!messes || messes.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No nearby messes found",
            }, { status: 202 });
        }

        const messIds = messes.map((mess) => mess._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        // Fetch daily menus for nearby messes and populate mess details
        const dailyMenus = await Dailymenu.find({
            mess: { $in: messIds } ,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).populate("mess")
        .sort({ "mess.distance": 1 });

        return NextResponse.json({
            success: true,
            message: "Daily Menu fetched successfully",
            dailyMenus: dailyMenus,  // Ensure "dailyMenus" key is used for frontend
        }, { status: 200 });

    } catch (error) {
        console.error("Backend error:", error);
        return NextResponse.json({
            success: false,
            message: `Error fetching daily menus: ${error.message}`,
        }, { status: 500 });
    }
}

