"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // Changed from success to message
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setMessage("Password reset successful. Redirecting to login...");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="glass border-0 shadow-2xl p-8 text-center max-w-md">
                    <CardTitle className="text-destructive mb-4">Invalid Reset Link</CardTitle>
                    <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
                    <Button asChild className="w-full">
                        <Link href="/forgot-password">Request New Link</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] animate-float" />
            <div className="absolute bottom-[15%] left-[10%] w-[25%] h-[25%] rounded-full bg-secondary/10 blur-[100px] animate-float animation-delay-2000" />

            <Card className="w-full max-w-md glass border-0 shadow-2xl relative z-10">
                <CardHeader className="space-y-4 pb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight">New Password</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Secure your account with a strong password.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="rounded-xl bg-primary/10 p-4 text-sm font-medium text-primary border border-primary/20">
                                {message}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-tight text-foreground/80 ml-1">New Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl bg-background/50 border-foreground/10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold tracking-tight text-foreground/80 ml-1">Confirm New Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 rounded-xl bg-background/50 border-foreground/10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button className="w-full h-12 text-base font-bold rounded-xl" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-foreground/5 pt-6">
                    <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
