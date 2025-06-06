import dbConnect from "@/lib/dbConnect.js";
import User from "@/model/user.model.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Mess from "@/model/mess.model";
import Cookie from 'js-cookie';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt'
import Subscription from "@/model/subscription.model";


export async function POST(request) {
    await dbConnect();

    try {

        const { email, password } = await request.json();
        const url = new URL(request.url);
        const queryParams = new URLSearchParams(url.search);
        const type = queryParams.get("acctype");

        if (!(email || password)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Both the fields credential and password are required",
                },
                { status: 400 }
            );
        }

        let user;
        if (type == "user") {
            user = await User.findOne({ email });
        } else if (type == "mess") {
            user = await Mess.findOne({ email });
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 400 }
            );
        }

        // if (!user.isVerified || !user.verificationStatus) {
        //     return NextResponse.json(
        //         { success: false, message: "Please verify your account first" },
        //         { status: 403 }
        //     );
        // }
        if (type=='user') {
            if (!user.isVerified) {
                return NextResponse.json(
                    { success: false, message: "Please verify your account first" },
                    { status: 403 }
                );
            }
        }else{
            if (!user.verificationStatus) {
                return NextResponse.json(
                    { success: false, message: "Please verify your account first" },
                    { status: 403 }
                );
            }
        }


        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 400 }
            );
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();

        // cookies().set({
        //     name: "accessToken",
        //     value: accessToken,
        //     httpOnly: true,
        //     path: "/",
        //     secure: true, // Set to true in production for HTTPS
        //     maxAge: 60 * 60 * 24, // Set expiry for 15 minutes (adjust as needed)
        //     sameSite: "strict",
        // });

        // // Set refreshToken cookie
        // cookies().set({
        //     name: "refreshToken",
        //     value: refreshToken,
        //     httpOnly: true,
        //     path: "/",
        //     secure: true,
        //     maxAge: 60 * 60 * 24 * 7, // Set expiry for 7 days
        //     sameSite: "strict",
        // });

        // NextResponse.setHeader('Set-Cookie', [
        //     serialize('accessToken', accessToken, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 }),
        //     serialize('refreshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 }),
        // ]);
        // return NextResponse.json(
        //     {
        //         success: true,
        //         message: "Login successful",
        //         accessToken,
        //         refreshToken,
        //     },
        //     { status: 200 }
        // );

        const cookieHeaders = [
            serialize('accessToken', accessToken, {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 1 day
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                sameSite: 'strict',
            }),
            serialize('refreshToken', refreshToken, {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                sameSite: 'strict',
            }),
        ];

        // Set the cookies in the response
        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
            },
            { status: 200 }
        );

        cookieHeaders.forEach(cookie => response.headers.append('Set-Cookie', cookie));

        let subs;
        if(type=="user"){
            subs = await Subscription.find({user:user._id});
        }else{
            subs = await Subscription.find({mess:user._id});
        }
            const time = Date.now();
            for (const subscription of subs) {
                if (subscription.expiry <= time) {
                    try {
                        await Subscription.deleteOne({ _id: subscription._id }); 
                        expired = true; 
                        console.log("Document deleted successfully.");
                    } catch (error) {
                        console.error("Error deleting document:", error);
                    }
                }
            }

            for (const subscription of subs) {
                if (subscription.startDate <= time) {
                    subscription.status = "Active";
                    await subscription.save();
                }
            }
        

        return response;

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { success: false, message: "Login failed" },
            { status: 500 }
        );
    }
}
