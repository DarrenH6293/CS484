import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { checkLoggedIn } from "@/lib/auth";

export async function POST(request) {
  const data = await request.json();
  const { email, password, displayName, phone, role } = data;
  if (email && password && displayName) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.User.create({
        data: {
          email,
          password: hashedPassword,
          displayName,
          phone,
          role
        }
      });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(user);
  }
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    if (email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      let user;
      try {
        user = await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
        return NextResponse.json({ message: 'Password reset successfully' });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    if (email && displayName && phone) {
      let user;
      try {
        user = await prisma.user.update({
          where: { email },
          data: { email: email, displayName: displayName, phone: phone },
        });
        return NextResponse.json({ message: 'Profile updated successfully' });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ error: 'Email, Password, or DisplayName not defined' }, { status: 500 });
}


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}