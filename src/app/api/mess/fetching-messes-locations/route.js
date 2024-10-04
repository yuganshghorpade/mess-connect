import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();
    try {
        const messes = await Mess.find();
        return NextResponse.json({
            success:true,
            message:"Locations fetched successfully",
            data:messes
        },{
            status:200
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
