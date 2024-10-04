import dbConnect from "@/lib/dbConnect";
import Dailymenu from "@/model/dailymenu.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const { id, type } = await getDataFromToken(request);
        console.log(type);
        const { menu } = await request.json();
        if (type == 'user') {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot set DailyMenu as a user..",
                },
                {
                    status: 400,
                }
            );
        }
        const existingMenu = await Dailymenu.findOne({ mess: id });
        if (existingMenu) {
            existingMenu.menu = menu;
            existingMenu.save();
            return NextResponse.json(
                {
                    success: true,
                    message: "Daily menu updated",
                },
                {
                    status: 200,
                }
            );
        }
        const response = await Dailymenu.create({
            mess: id,
            menu,
        });
        return NextResponse.json(
            {
                success: true,
                message: "Daily menu set",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: `Some error occured while creating Daily Menu for your Mess.Error:-${error}`,
            },
            {
                status: 500,
            }
        );
    }
}
