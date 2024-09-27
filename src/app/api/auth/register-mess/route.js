import dbConnect from '@/lib/dbConnect.js';
import Mess from '@/model/mess.model';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

    try {
        const { name, email, password, address, contactNo, isPureVegetarian, openHours } = await request.json();
        

        // Check if all required fields are provided
        if (!name || !email || !password || !address || !contactNo) {
            return NextResponse.json({
                success: false,
                message: "All the starred fields are required"
            }, { status: 400 });
        }

        // Check if mess already exists
        const existingMess = await Mess.findOne({ email });
        if (existingMess) {
            return NextResponse.json(
                { success: false, message: 'Mess already exists with this email' },
                { status: 400 }
            );
        }

        const newMess = new Mess({
            name,
            email,
            password, // Password will be hashed in the model
            address,
            contactNo,
            isPureVegetarian: isPureVegetarian || false,
            openHours: openHours || "",
            verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
            verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour from now
            verificationStatus: false,
        });

        await newMess.save();

    return NextResponse.json(
      { success: true, message: 'Mess registered successfully. Please verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering mess:', error);
    return NextResponse.json(
      { success: false, message: 'Error registering mess' },
      { status: 500 }
    );
  }
}
