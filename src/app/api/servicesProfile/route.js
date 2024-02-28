import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { checkLoggedIn } from "@/lib/auth";
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      description,
      minPrice,
      maxPrice,
      address,
      range,
      typeID,
      vendorID,
    } = data;

    const newService = await prisma.Service.create({
      data: {
        minPrice,
        maxPrice,
        address,
        range,
        description,
        name,
        vendor: {
          connect: { id: vendorID },
        },
        type: {
          connect: { id: typeID },
        },
      },
    });
    return NextResponse.json(
      { status: 200 },
      { body: { message: "Service created successfully", service: newService } }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { status: 500 },
      { body: { message: "Internal Server Error" } }
    );
  }
}
