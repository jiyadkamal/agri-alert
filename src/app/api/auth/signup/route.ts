import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/firestore";
import { hashPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate Input
        const result = signupSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Check if user exists (Firestore)
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 }
            );
        }

        // Hash Password
        const hashedPassword = await hashPassword(password);
        const verificationToken = Math.random().toString(36).substring(2, 12);

        // Create User (Firestore)
        const newUser = await createUser({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            isOnboarded: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Create Token
        const token = signToken({ id: newUser.uid!, email: newUser.email });

        // Return response
        return NextResponse.json(
            {
                message: "User created successfully.",
                token,
                user: {
                    id: newUser.uid,
                    name: newUser.name,
                    email: newUser.email,
                    isOnboarded: newUser.isOnboarded,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
