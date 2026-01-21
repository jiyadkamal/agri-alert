import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/firestore";
import { comparePassword, signToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate Input
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Find User (Firestore)
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify Password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create Token
        const token = signToken({ id: user.uid!, email: user.email });

        return NextResponse.json(
            {
                message: "Login successful",
                token,
                user: {
                    id: user.uid,
                    name: user.name,
                    email: user.email,
                    isOnboarded: user.isOnboarded,
                    location: user.location,
                    crops: user.crops,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
