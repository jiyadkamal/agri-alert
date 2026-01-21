import { NextResponse } from "next/server";
import { updateUser } from "@/lib/firestore";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { JwtPayload } from "jsonwebtoken";

const onboardingSchema = z.object({
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    crops: z.array(z.string()).min(1, "At least one crop is required"),
});

export async function POST(req: Request) {
    try {
        // Get token from header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        let decoded: string | JwtPayload;
        try {
            decoded = verifyToken(token);
        } catch (e) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }

        if (typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ error: "Invalid Token Payload" }, { status: 401 });
        }

        const body = await req.json();

        // Validate Input
        const result = onboardingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { state, district, crops } = result.data;

        // Update User (Firestore)
        try {
            const updatedUser = await updateUser(decoded.id, {
                location: { state, district },
                crops,
                isOnboarded: true,
            });

            return NextResponse.json(
                {
                    message: "Onboarding completed",
                    user: {
                        id: updatedUser.uid,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        isOnboarded: updatedUser.isOnboarded,
                        location: updatedUser.location,
                        crops: updatedUser.crops
                    },
                },
                { status: 200 }
            );
        } catch (err: any) {
            // Check for 'not found' from Firestore (code 5)
            if (err.code === 5 || err.message?.includes('NOT_FOUND')) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            throw err;
        }

    } catch {
        console.error("Onboarding Error");
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
