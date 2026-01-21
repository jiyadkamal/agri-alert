"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Loader2, KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setMessage("If an account exists with that email, we've sent a reset link.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Visual Gradient/Image Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-agri-green to-black overflow-hidden items-center justify-center p-12">
                {/* Abstract Shapes with Animation */}
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 animate-[pulse-glow_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-agri-green/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 animate-[pulse-glow_10s_ease-in-out_infinite_2s]"></div>

                <div className="relative z-10 text-white max-w-lg animate-[fade-in-up_0.6s_ease-out]">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 hover:scale-110 hover:rotate-3 transition-all duration-300">
                        <KeyRound className="h-8 w-8 text-blue-200" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">Recover Access.</h1>
                    <p className="text-lg text-white/70 leading-relaxed">
                        We'll help you get back to your dashboard so you don't miss any critical alerts.
                    </p>
                </div>

                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-background relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-[pulse-glow_6s_ease-in-out_infinite]" />

                <Card className="w-full max-w-sm glass-card border-0 shadow-none bg-transparent p-6">
                    <CardHeader className="space-y-2 pb-6 text-left">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Forgot Password?</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            No worries, we&apos;ll help you get back in.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message ? (
                            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95">
                                <div className="rounded-xl bg-primary/10 p-6 text-sm font-medium text-primary border border-primary/20">
                                    {message}
                                </div>
                                <Button asChild variant="outline" className="w-full h-11 rounded-lg">
                                    <Link href="/login">Return to Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20 animate-in fade-in slide-in-from-left-1 flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-destructive mr-2" /> {error}
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium leading-none">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="h-11 rounded-lg bg-background/50"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <Button className="w-full h-11 text-base font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" type="submit" disabled={loading} variant="premium">
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-start border-t border-foreground/5 pt-6">
                        <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Sign In
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
