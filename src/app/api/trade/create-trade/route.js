import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import Trade from "@/model/trade.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        await dbConnect();
        const { userid, messid, type, amount } = await request.json();
        
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        const subscription = await Subscription.find({
            owner: userid,
            mess: messid,
            status: "Active",
            mealtype: type
        });
        if (!subscription) {
            return NextResponse.json({
                success: false,
                message: "Subscription not found or Meal already Traded"
            }, {
                status: 404
            })
        }
        const trade = await Trade.find({
            owner: userid,
            mess:messid,
            createdAt:{ $gte: startOfDay, $lte: endOfDay },
            mealtype:type
        })
        if(trade){
            return NextResponse.json({
                success: false,
                message: "Meal already Traded",
                trade
            }, {
                status: 404
            })
        }
        await Trade.create({ owner: userid, mess: messid, mealtype: type, amount: amount });
        return NextResponse.json({
            success: true,
            message: "Trade Created Successfully",
        }, {
            status: 200
        })
    
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Some error occured while creating trade. Error:-${error}`
        }, {
            status: 500
        })
    }
}
