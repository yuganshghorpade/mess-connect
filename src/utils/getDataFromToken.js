import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getDataFromToken = (request) => {
    try {
        const token = cookies().get("accessToken");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decodedToken.id, decodedToken.type ;
    } catch (error) {
        console.error(error);
    }

}