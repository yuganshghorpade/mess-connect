import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/subscription.model";
import Subscription_Extension_Request from "@/model/subscription_extension_request.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  await dbConnect();

  try {
    const { id, type } = await getDataFromToken(request);

    if (type === "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Bad Request",
        },
        {
          status: 402,
        }
      );
    }

    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    const requestId = queryParams.get("requestId");
    const decision = queryParams.get("decision");

    if (!decision || !requestId) {
      return NextResponse.json(
        {
          success: false,
          message: "Data required",
        },
        {
          status: 403,
        }
      );
    }

    const extensionRequest = await Subscription_Extension_Request.findById(requestId);

    if (!extensionRequest || extensionRequest.status !== "Pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Request is inappropriate",
        },
        {
          status: 500,
        }
      );
    }

    extensionRequest.status = decision;
    await extensionRequest.save();

    if (decision === "Accepted") {
      const subscription = await Subscription.findById(extensionRequest.subscription);

      if (!subscription) {
        return NextResponse.json(
          {
            success: false,
            message: "Subscription not found",
          },
          {
            status: 404,
          }
        );
      }

      
      const from = new Date(extensionRequest.fromDate);
      const to = new Date(extensionRequest.toDate);
      const extensionInMs = to.getTime() - from.getTime();

     
      subscription.expiry = new Date(subscription.expiry.getTime() + extensionInMs);
      await subscription.save();

      return NextResponse.json(
        {
          success: true,
          message: "Subscription time extended successfully",
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request rejected successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Caught error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Some error occurred while reacting to request. Error: ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
}
