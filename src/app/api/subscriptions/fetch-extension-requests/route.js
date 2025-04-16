import dbConnect from "@/lib/dbConnect";
import Subscription_Extension_Request from "@/model/subscription_extension_request.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    try {
        const { id, type } = await getDataFromToken(request);

      
        if (type === "user") {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access by user",
            }, {
                status: 403
            });
        }

      
        const extension_requests = await Subscription_Extension_Request
        .find({ mess: id })
        .select("fromDate toDate status _id");
    

        console.log("Fetched Extension Requests:", extension_requests); 

        return NextResponse.json({
            success: true,
            message: "Fetched extension requests successfully",
            extension_requests
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error fetching extension requests:", error);
        return NextResponse.json({
            success: false,
            message: `Error occurred: ${error.message}`
        }, {
            status: 500
        });
    }
}
