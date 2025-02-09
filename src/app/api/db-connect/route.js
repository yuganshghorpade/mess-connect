import dbConnect from "@/lib/dbConnect.js";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        // const createSampleData = async () => {
        //     // Create a new user
        //     const user = new User({ 
        //         name: 'John Doe', 
        //         username: 'johndoedoe',
        //         email: 'john.doe.doe@example.com', 
        //         contactNo:9090909090, 
        //         password: "JohnDoe" });
        //     await user.save();
        // }
        // createSampleData()
        const status = await bcrypt.compare("hakka","$2b$10$OoNxP6KwTH9gJ.9mTAc8cuMdBkMPffwPvOmhhiNE/f0HR.64vFS7i")
        console.log(status)
        return NextResponse.json({
            message:"Server is running on port 8000 and data created"
        })
    } catch (error) {
        console.error(error)
    }
}