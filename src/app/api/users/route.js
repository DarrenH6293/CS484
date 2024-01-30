import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const data = await request.json();
  const { email, password } = data;
  if (email && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: { email, password: hashedPassword }
      });
    } catch (e) {
      return NextResponse.json({error: e.message}, {status: 500 })
    }
    return NextResponse.json(user);
  }
  return NextResponse.json({ error: 'Email or Password not defined' }, { status: 500 });
}