import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const getDataFromToken = (request) => {
    try {
        const token = cookies().get("accessToken");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decodedToken.id, decodedToken.type ;
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"You are not logged in..."
        },{
            status:400
        })
    }

}