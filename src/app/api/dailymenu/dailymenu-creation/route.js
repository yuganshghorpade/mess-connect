import dbConnect from "@/lib/dbConnect";
import Dailymenu from "@/model/dailymenu.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect()
        const {id, type} = getDataFromToken(request);
        const {menu} = await request.json();
        if (type=="user") {
            return NextResponse.json({
                success:false,
                message: "You cannot set DailyMenu as a user.."
            },{
                status:400
            })
        }
        const existingMenu = await Dailymenu.findOne({mess:id})
        if (existingMenu) {
            return NextResponse.json({
                success:false,
                message: "You cannot set more than one daily menu... Please update the already created menu"
            },{
                status:400
            })
        }
        const response = await Dailymenu.create({
            mess:id,
            menu
        })
        return NextResponse.json({
            success:true,
            message: "Daily menu set"
        },{
            status:200
        })

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Some error occured while creating Daily Menu for your Mess.Error:-${error}`
        },{
            status:500
        })
    }
}