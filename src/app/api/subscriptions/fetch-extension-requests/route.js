import dbConnect from "@/lib/dbConnect";
import Subscription_Extension_Request from "@/model/subscription_extension_request.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    try {
        const {id,type} = await getDataFromToken(request);

        if(type=="user"){
            return NextResponse.json({
                success:false,
                message:"Bad Request"
            },{
                status:402
            })
        }

        const extension_requests = await Subscription_Extension_Request.find({
            mess:id
        });

        return NextResponse.json({
            success:true,
            message:"Subscription Extension Request created successfully",
            extension_requests
        },{
            status:200
        })

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while creating Subscription Extension Request.Error:-${error}`
        },{
            status:500
        })
    }
}