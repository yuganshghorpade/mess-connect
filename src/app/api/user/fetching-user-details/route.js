import dbConnect from "@/lib/dbConnect";
import Mess from "@/model/mess.model";
import User from "@/model/user.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
            },
            { status: 500 }
        );
    }

    try {
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const messId = queryParams.get("messid");

        let user;
        if (messId) {
            user = await Mess.findById(messId);
            if (!user) {
              return NextResponse.json(
                  {
                      success: false,
                      message: "Mess not found",
                  },
                  { status: 404 }
              );
          }
        }else{
        const { id, type } = await getDataFromToken(request);
        console.log("Token Data: ", { id, type });

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized request",
                },
                { status: 400 }
            );
        }

        
        if (type === "user") {
            user = await User.findById(id).select("-password -refreshToken");
        } else if (type === "mess") {
            user = await Mess.findById(id).select("-password -refreshToken");
        }

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
      }
        return NextResponse.json(
            {
                success: true,
                message: "User details sent successfully",
                response: user, // Ensure the user data is included here
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json(
            {
                success: false,
                message: `Some error occurred while fetching user details. Error: ${error.message}`,
                stack: error.stack, // Add stack trace to debug the error
            },
            { status: 500 }
        );
    }
}
