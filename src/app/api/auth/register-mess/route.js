import dbConnect from '@/lib/dbConnect.js';
import Mess from '@/model/mess.model.js';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  console.log(NextResponse);

  try {
    const { name, email, password, address, contactNo, isPureVegetarian, openHours } = await request.json();

    if (!(name,email,password,address,contactNo)) {
        return NextResponse.json({
            success:false,
            message:"All the starred fields are required"
        },{
            status:400
        })
    }
    
    const existingMess = await Mess.findOne({ name });

    if (existingMess) {
      return NextResponse.json(
        { success: false, message: 'Mess already exists with this email' },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newMess = new Mess({
      name,
      email,
      password,
      address,
      contactNo,
      isPureVegetarian: isPureVegetarian || false,
      openHours : openHours || "",
      verifyCode,
      verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      verificationStatus: false,
    });

    await newMess.save();

    return NextResponse.json(
      { success: true, message: 'Mess registered successfully. Please verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success:false,
      message:`Some error occured while registering mess. Error:-${error}`
  },{
      status:500
  })
  }
}
