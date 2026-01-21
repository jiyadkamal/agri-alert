import { NextResponse } from "next/server";
import { getUserByResetToken, updateUser } from "@/lib/firestore";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const resetSchema = z.object({
    token: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = resetSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { token, password } = result.data;

        // Find User (Firestore)
        const user = await getUserByResetToken(token);

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Update User
        await updateUser(user.uid!, {
            password: hashedPassword,
            resetToken: "", // clear token
            // resetTokenExpiry: "" // clear expiry
            // Note: Cleaner way would be FieldValue.delete() but simple update works for now
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
