import Subscription from "@/model/subscription.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const {userId, type} = await getDataFromToken(request)
        await Subscription.updateExpiredSubscriptions(userId,type);
    
        const query = type === "user" 
            ? { user : userId } 
            : { mess : userId }
        
        const response = await Subscription.find(query)
        .populate("mess user")
        .sort({createdAt : -1})
    
        return NextResponse.json({
            success:true,
            message:"Response fetched successfully"
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