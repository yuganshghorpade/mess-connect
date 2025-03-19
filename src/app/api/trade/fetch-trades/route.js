import dbConnect from "@/lib/dbConnect";
import Trade from "@/model/trade.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        const {id, type} = await getDataFromToken(request)
        if(type=="trader"){
            const trades = await Trade.find({ status: "Pending" })
            .populate("owner mess trader")
            .sort({createdAt : -1})
            return NextResponse.json({
                success: true,
                message:"Trades fetched successfully",
                trades
            }, {
                status: 200
            })
        }
        else{
            const trades = await Trade.find({ owner: id })
            .populate("owner mess trader")
            .sort({createdAt : -1})
            return NextResponse.json({
                success: true,
                message:"Trades fetched successfully",
                trades
            }, {
                status: 200
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
