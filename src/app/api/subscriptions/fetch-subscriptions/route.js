import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        const {id, type} = await getDataFromToken(request)
        await Subscription.updateExpiredSubscriptions(id,type);
    
        const query = type === "user" 
            ? { user : id } 
            : { mess : id }
        
        const response = await Subscription.find(query)
        .populate("mess user")
        .sort({createdAt : -1})
    
        return NextResponse.json({
            success:true,
            message:"Response fetched successfully",
            response
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while fetching subscriptions/subscribers. Error:-${error}`
        },{
            status:500
        })
    }
}