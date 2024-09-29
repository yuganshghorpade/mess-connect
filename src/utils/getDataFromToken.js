// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export const getDataFromToken = (request) => {
//     try {
//         const cookieJar = cookies();
//         const tokenCookie = cookieJar.get('accessToken'); // Get cookie object
//         console.log(tokenCookie);
//         const token = tokenCookie?.value; // Extract the token value
//         console.log(token);
//         if (!token) {
//             throw new Error("Token not found");
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Return both id and type in an object
//         return { id: decodedToken.id, type: decodedToken.type };
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: "You are not logged in..."
//         }, {
//             status: 400
//         });
//     }
// }
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const getDataFromToken = async (request) => {
    try {
        const cookieHeader = request.headers.get("cookie");
        const parseCookies = (cookieHeader) => {
            return Object.fromEntries(
                cookieHeader.split("; ").map((cookie) => cookie.split("="))
            );
        };
        const cookies = parseCookies(cookieHeader);
        const token = cookies["accessToken"];
        // console.log(token);

        // const cookieJar = cookies(); // Get the cookies object
        // const tokenCookie = cookieJar.get('accessToken'); // Retrieve the 'accessToken' cookie

        // // Debugging
        // console.log("Token cookie:", tokenCookie);

        // const token = tokenCookie?.value; // Get the value of the token
        // if (!token) {
        //     throw new Error("Token not found"); // Handle missing token
        // }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Return ID and type from the token payload
        return { id: decodedToken.id, type: decodedToken.type };
    } catch (error) {
        console.error("Error during token processing:", error); // Log the error for debugging

        // Return error response
        return NextResponse.json(
            {
                success: false,
                message: "You are not logged in or token is invalid...",
            },
            {
                status: 401, // Use 401 for unauthorized access
            }
        );
    }
};
