import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import Subscription_Extension_Request from "@/model/subscription_extension_request.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {
        const { id, type } = await getDataFromToken(request);

        if (type === "mess") {
            return NextResponse.json({
                success: false,
                message: "Bad Request"
            }, {
                status: 402
            });
        }

        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const subscriptionId = queryParams.get("subscriptionId");

        const { fromDate, toDate } = await request.json();

        console.log("fromDate", fromDate);
        console.log("toDate", toDate);
        console.log("subscriptionId", subscriptionId);

        if (!fromDate || !toDate || !subscriptionId) {
            return NextResponse.json({
                success: false,
                message: "Data required"
            }, {
                status: 403
            });
        }

        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            user: id,
            status: "Active"
        });

        if (!subscription) {
            return NextResponse.json({
                success: false,
                message: "User not subscribed to the mess or the subscription is Queued"
            }, {
                status: 500
            });
        }

        const extension_request = await Subscription_Extension_Request.create({
            user: id,
            mess: subscription.mess,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            subscription: subscriptionId,
            status: "Pending",
        });

        return NextResponse.json({
            success: true,
            message: "Subscription Extension Request created successfully"
        }, {
            status: 200
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Some error occurred while creating Subscription Extension Request. Error: ${error}`
        }, {
            status: 500
        });
    }
}
