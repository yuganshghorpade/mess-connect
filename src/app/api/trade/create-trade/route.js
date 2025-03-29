import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import Trade from "@/model/trade.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    
    try {
        await dbConnect();
        const { userid, messid, type, amount } = await request.json();
        console.log(userid, messid, type, amount);
        const subscription = await Subscription.find({ 
            owner: userid, 
            mess: messid, 
            status: "Active",
            mealType: type
        });
        if (subscription) {
            await Trade.create({ owner: userid, mess: messid, mealtype: type, amount: amount });
            return NextResponse.json({
                success: true,
                message: "Trade Created Successfully",
            }, {
                status: 200
            })
        }else{
            return NextResponse.json({
                success: false,
                message: "Subscription not found"
            }, {
                status: 404
            })
        }
    } catch (error) {
        return NextResponse.json({
                success:false,
                message:`Some error occured while creating trade. Error:-${error}`
        },{
            status:500
        })
    }
}
