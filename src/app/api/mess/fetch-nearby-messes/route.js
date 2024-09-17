import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function POST(request){
    await dbConnect();
    const radiusInKm = 5;
    const radiusInRadians = radiusInKm / 6378.1;

    const { latitude, longitude } = await request.json()
    const userCoordinates = [longitude,latitude]

    try {
        const nearbyMesses = await Mess.find({
            location: {
                $geoWithin: {
                    $centerSphere: [userCoordinates, radiusInRadians]
                }
            }
        })
        return NextResponse.json({
            success:true,
            message:"Messes fetched successfully"
        },{
            status:200
        },{
            nearbyMesses
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while fetching nearby messes.Error:-${error}`
        },{
            status:500
        })
    }
}
