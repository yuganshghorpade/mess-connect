import dbConnect from '@/lib/dbConnect.js';
import User from '@/model/user.model.js';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect(); // Ensure database connection

  try {
    const { username, email, password, contactNo } = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUser) {
      // Check if the user is already verified
      if (existingUser.isVerified) {
        return NextResponse.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      } else {
        // Update the password and verification code for the unverified user
        existingUser.password = await bcrypt.hash(password, 10); // Hash the new password
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry
        await existingUser.save();
      }
    } else {
      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000); // 1-hour expiry

      // Create and save a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword, // Store hashed password
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: true, // Mark as not verified initially
        contactNo,
      });

      await newUser.save();
    }

    // Send success response
    return NextResponse.json(
      { success: true, message: 'User registered successfully. Please verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    // Send error response
    return NextResponse.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}
