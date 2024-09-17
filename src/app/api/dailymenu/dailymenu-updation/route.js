import Dailymenu from "@/model/dailymenu.model.js";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {userId, type} = getDataFromToken(request);
        const {newMenu} = await request.json();
        if (type=="user") {
            return NextResponse.json({
                success:false,
                message: "You cannot set DailyMenu as a user.."
            },{
                status:400
            })
        }
        const existingMenu = await Dailymenu.find({mess:userId})
        if (!existingMenu) {
            await Dailymenu.create({
                mess:userId,
                menu:newMenu
            })
            return NextResponse.json({
                success:true,
                message: "DailyMenu not found for updation. New DailyMenu created"
            },{
                status:200
            })
        }
        existingMenu.menu = newMenu;
        existingMenu.save();
        return NextResponse.json({
            success:true,
            message: "Daily menu updated"
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while updating Daily Menu for your Mess.Error:-${error}`
        },{
            status:500
        })
    }
}