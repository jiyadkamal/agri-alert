import { NextResponse } from "next/server";
import { getUserByVerificationToken, updateUser } from "@/lib/firestore";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Missing token" }, { status: 400 });
        }

        const user = await getUserByVerificationToken(token);

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        await updateUser(user.uid!, {
            isVerified: true,
            verificationToken: "" // Clear it
        });

        // Redirect to login with success message
        return NextResponse.redirect(new URL("/login?verified=true", req.url));
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
