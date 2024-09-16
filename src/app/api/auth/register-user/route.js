import dbConnect from '@/lib/dbConnect.js';
import User from '@/model/user.model.js';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { username, email, password, contactNo } = await request.json();
    // console.log("username-",username);
    // console.log("email-",email);
    // console.log("password-",password);
    // console.log("contactNo-",contactNo);
    const existingUser = await User.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      } else {
        existingUser.password = password;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await existingUser.save();
      }
    } else {
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

      const newUser = new User({
        username,
        email,
        password: password,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        contactNo,
      });

      await newUser.save();
    }

    return NextResponse.json(
      { success: true, message: 'User registered successfully. Please verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}
