'use client'
import dbConnect from '@/lib/dbConnect.js';
import User from '@/model/user.model.js';
import Mess from '@/model/mess.model.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, verifyCode} = await request.json();
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    const userType = queryParams.get("acctype");

    let account;
    if (userType === 'user') {
      account = await User.findOne({ email });
    } else if (userType === 'mess') {
      account = await Mess.findOne({ email });
    }

    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Account not found' },
        { status: 404 }
      );
    }

    if (account.verifyCode !== verifyCode || account.verifyCodeExpiry < Date.now()) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    account.isVerified = true;
    account.verifyCode = null;
    account.verifyCodeExpiry = null;
    await account.save();

    return NextResponse.json(
      { success: true, message: 'Account verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying account:', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying account' },
      { status: 500 }
    );
  }
}
