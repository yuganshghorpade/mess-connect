import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import User from "@/model/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();
    try {
        const {id,type} = await getDataFromToken(request)
        if (!id) {
            return NextResponse.json({
                success:false,
                message:"Unauthorised request"
            },{
                status:400
            })
        }

        let user;
        if (type == "user") {
            user = await User.findById(id).select("-password -refreshToken -password");
        } else if (type == "mess") {
            user = await Mess.findById(id).select("-password refreshToken");
        }
        if (!user) {
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }
        return NextResponse.json({
            success:true,
            message:"User details sent successfully"
        },{
            status:200
        },{
            response:user
        })


    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while fetching user details. Error:-${error}`
        },{
            status:500
        })
    }
}