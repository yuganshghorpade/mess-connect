import dbConnect from "@/lib/dbConnect";
import Dailymenu from "@/model/dailymenu.model";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect()
    try {
        const { longitude, latitude } = await request.json();
        const userCoordinates = [longitude, latitude];
        const messes = await Mess.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: userCoordinates },
                    distanceField: "distance",
                    spherical: true,
                },
            },
        ]);
        const messIds = messes.map((mess) => mess._id);
        const dailyMenus = await Dailymenu.find({ mess: { $in: messIds } })
            .populate("mess")
            .sort({ "mess.distance": 1 });

        return NextResponse.json({
            success:true,
            message:"Daily Menu fetched successfully"
        },{
            status:500
        },{
            response:dailyMenus
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while fetching nearby messes daily menu.Error:-${error}`
        },{
            status:500
        })
    }
}
