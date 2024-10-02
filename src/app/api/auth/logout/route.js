import dbConnect from '@/lib/dbConnect.js';
import User from '@/model/user.model.js';
import Mess from '@/model/mess.model.js';
import { NextResponse } from 'next/server';
import { getDataFromToken } from '@/utils/getDataFromToken';
import { cookies } from 'next/headers';

export async function POST(request) {
  await dbConnect();

  try {
    const {id,type} = await getDataFromToken(request);

    let account;
    if (type === 'user') {
      account = await User.findById(id)
    } else if (type === 'mess') {
      account = await Mess.findById(id);
    }

    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Account not found' },
        { status: 404 }
      );
    }

    account.refreshToken = null;
    await account.save();
    cookies().delete("accessToken")
    cookies().delete("refreshToken")

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { success: false, message: 'Error during logout' },
      { status: 500 }
    );
  }
}
