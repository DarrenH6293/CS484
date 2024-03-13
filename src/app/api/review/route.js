import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const reviews = await prisma.review.findMany();
        return NextResponse.json({ reviews });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}
export async function PUT(request) {
    try {
        const data = await request.json();
        const { stars, description, date, authorID, serviceID } =
            data;

        const notif = await prisma.Review.create({
            data: {
                stars,
                description,
                date,
                author: {
                    connect: { id: authorID },
                },
                service: {
                    connect: { id: serviceID },
                },
            },
        });

        return NextResponse.json({ status: 200, Review });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { status: 500 },
            { body: { message: "Internal Server Error" } }
        );
    }
}