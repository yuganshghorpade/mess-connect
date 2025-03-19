import dbConnect from "@/lib/dbConnect";
import Trade from "@/model/trade.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request) {
    
    try {
        await dbConnect();
        const {id, type} = await getDataFromToken(request)

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const tradeid = queryParams.get("tradeId");
        const trade = await Trade.findById(tradeid);
        if ( trade && trade.status=="Pending") {
            trade.status = "Accepted";
            trade.trader = id;
            await trade.save();
            return NextResponse.json({
                success: true,
                message: "Trade Booked Successfully",
            }, {
                status: 200
            })
        }
        return NextResponse.json({
            success: false,
            message: "Trade not found"
        }, {
            status: 404
        })
    }
    catch (error) {
        return NextResponse.json({
                success:false,
                message:`Some error occured while booking trade. Error:-${error}`
        },{
            status:500
        })
    }
}