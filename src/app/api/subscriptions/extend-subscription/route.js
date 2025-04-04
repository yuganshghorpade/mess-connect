import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function PATCH(request) {
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

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const subscriptionId = queryParams.get("subscriptionId");

        const {days} = await request.json();

        if(!days || !subscriptionId || !id){
            return NextResponse.json({
                success:false,
                message:"Data required"
            },{
                status:403
            })
        }

        const subscription = await Subscription.findById(subscriptionId);

        if(!subscription || subscription.status!=="Active"){
            return NextResponse.json({
                success:false,
                message: "User not subscribed to the mess or the subscription is Queued"
            },{
                status:500
            })
        }

        const expiry = subscription.expiry;
        subscription.expiry = expiry + days * 24 * 60 * 60 * 1000;
        subscription.save();

        return NextResponse.json({
            success:true,
            message:"Subscription time extended successfully"
        },{
            status:200
        })

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while subscribing a mess.Error:-${error}`
        },{
            status:500
        })
    }
}