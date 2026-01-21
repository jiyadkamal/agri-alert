"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.isOnboarded) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Visual Gradient/Image Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-agri-green to-black overflow-hidden items-center justify-center p-12">
                {/* Abstract Shapes with Animation */}
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-agri-green/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 animate-[pulse-glow_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-agri-gold/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 animate-[pulse-glow_10s_ease-in-out_infinite_2s]"></div>

                <div className="relative z-10 text-white max-w-lg animate-[fade-in-up_0.6s_ease-out]">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 hover:scale-110 hover:rotate-3 transition-all duration-300">
                        <ShieldCheck className="h-8 w-8 text-agri-gold" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">Secure Intelligence for your Farm.</h1>
                    <p className="text-lg text-white/70 leading-relaxed">
                        Access real-time market data, weather forecasts, and government schemes tailored specifically for your land.
                    </p>
                </div>

                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-[pulse-glow_6s_ease-in-out_infinite]" />

                <Card className="w-full max-w-sm glass-card border-0 shadow-none bg-transparent p-6">
                    <CardHeader className="space-y-2 pb-6 text-left">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            Enter your credentials to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive border border-destructive/20 animate-in fade-in slide-in-from-left-1 flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> {error}
                                </div>
                            )}
                            {typeof window !== "undefined" && window.location.search.includes("verified=true") && (
                                <div className="rounded-lg bg-primary/10 p-3 text-sm font-medium text-primary border border-primary/20">
                                    Email verified successfully!
                                </div>
                            )}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="h-11 rounded-lg bg-background/50"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="h-11 rounded-lg bg-background/50"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-full h-11 text-base font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                type="submit"
                                variant="premium"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            New to AgriAlert?{" "}
                            <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
