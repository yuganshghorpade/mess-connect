import dbConnect from "@/lib/dbConnect";
import Trade from "@/model/trade.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        const {id, type} = await getDataFromToken(request)
        if(type=="user"){
            const startOfDay = new Date();
            startOfDay.setUTCHours(0, 0, 0, 0);
        
            const endOfDay = new Date();
            endOfDay.setUTCHours(23, 59, 59, 999);

            const trades = await Trade.find({
                status: "Pending",
                createdAt:{ $gte: startOfDay, $lte: endOfDay },
            })
            .populate("owner mess trader")
            .sort({createdAt : -1})
            console.log(trades);
            return NextResponse.json({
                success: true,
                message:"Trades fetched successfully",
                trades
            }, {
                status: 200
            })
        }
        else{
            return NextResponse.json({
                success: false,
                message:"Bad Request",
                trades
            }, {
                status: 400
            })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Some error occured while fetching trades. Error:-${error}`
        }, {
            status: 500
        })
    }
}
