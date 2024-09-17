import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();
    try {
        const messes = await Mess.find({}, 'name location.coordinates');
        return NextResponse.json({
            success:true,
            message:"Locations fetched successfully"
        },{
            status:200
        },{
            data:messes
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while fetching mess locations for mess.Error:-${error}`
        },{
            status:500
        })
    }
}
