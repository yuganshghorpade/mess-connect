import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import User from "@/model/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request){
    await dbConnect();
    try {
        const {userid,type} = await getDataFromToken(request);
        const {messId,mealType,durationInMilliseconds} = await request.json();
        if (type=="mess") {
            return NextResponse.json({
                success:false,
                message:"Unauthorised Request"
            },{
                status:401
            })
        }
        const user = await User.findById(userid)
        if (!user) {
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{
                status:404
                
                
            })
        }

        const existingSubscription = await Subscription.findOne({
            user:userid,
            mealType:mealType,
            status:'Active'
        })
        // if (existingSubscription) {
        //     await Subscription.create({
        //         user: userid,
        //         mess: messId,
        //         mealType: mealType,
        //         startDate: existingSubscription.expiry,
        //         status:"Queued",
        //         expiry:existingSubscription.expiry + durationInMilliseconds
        //     })
        // }else{
        //     await Subscription.create({
        //         user: userid,
        //         mess: messId,
        //         mealType: mealType,
        //         startDate: Date.now(),
        //         status:"Active",
        //         expiry:durationInMilliseconds
        //     })
        // }

        const subscription = await Subscription.create({
            user : userid,
            mess : messId,
            mealType : mealType,
            status : existingSubscription ? "Queued" : "Active",
            startDate : existingSubscription ? existingSubscription.expiry : Date.now(),
            expiry : existingSubscription ? (existingSubscription.expiry + durationInMilliseconds) : (Date.now() + durationInMilliseconds)
        })

        if (!subscription) {
            return NextResponse.json({
                success:false,
                message:`Some error occured while creating a Subscription.Error:-${error}`
            },{
                status:500
            })
        }
        return NextResponse.json({
            success:true,
            message:"Mess subscribed successfully"
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