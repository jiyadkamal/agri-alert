import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/firestore";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            // Don't reveal if user exists or not for security, but for now we'll be helpful
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour, ISO String for Firestore

        await updateUser(user.uid!, {
            resetToken,
            resetTokenExpiry
        });

        // MOCK EMAIL SENDING
        console.log(`[MOCK EMAIL] Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

        return NextResponse.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
