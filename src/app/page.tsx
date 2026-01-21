"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Newspaper, CloudRain, TrendingUp, ArrowRight, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* Decorative Background Elements with Enhanced Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/8 to-agri-green/5 blur-[140px] animate-[float_8s_ease-in-out_infinite] md:w-[40%] md:h-[40%]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-agri-gold/8 to-accent/5 blur-[120px] animate-[float_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
      </div>

      {/* Navigation */}
      <header className="px-6 h-20 flex items-center glass sticky top-4 mx-4 rounded-2xl z-50 mt-4 border border-white/40 shadow-2xl shadow-black/10 transition-all duration-500 hover:shadow-primary/10">
        <Link className="flex items-center justify-center group" href="/">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-agri-green rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-primary/30">
            <Sprout className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 tracking-tight">AgriAlert</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="hidden md:block text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105" href="/login">
            Sign In
          </Link>
          <Button asChild variant="premium" size="lg" className="rounded-full px-6">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-10 text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-sm">
                <ShieldCheck className="mr-2 h-4 w-4" /> Trusted by 10,000+ Modern Farmers
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none text-foreground text-balance">
                  Intelligence for your <br />
                  <span className="bg-gradient-to-r from-primary via-agri-green to-agri-gold bg-clip-text text-transparent pb-2">Agriculture Success.</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                  Personalized agricultural intelligence, local market trends, and critical weather alerts—all tailored to your specific district and crops.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 shrink-0 w-full sm:w-auto">
                <Button asChild size="xl" variant="premium" className="px-10 text-lg rounded-full shadow-2xl shadow-primary/25 hover:scale-105 transition-transform">
                  <Link href="/signup">Join the Revolution <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="px-10 text-lg rounded-full glass border-foreground/10 hover:bg-foreground/5 transition-all hover:scale-105">
                  <Link href="/login">Live Demo</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Decorative Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 relative bg-secondary/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Everything you need to grow better.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform integrates data from satellites, local markets, and government policies to give you a complete picture.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: CloudRain, title: "Precision Weather", desc: "Hyper-local forecasts and severe weather warnings for your specific coordinates.", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-200/20" },
                { icon: Newspaper, title: "Curated News", desc: "We filter out the noise. Only see news that impacts the crops you grow.", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-200/20" },
                { icon: TrendingUp, title: "Mandi Insights", desc: "Real-time pricing from your local Mandis to help you sell at the right time.", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-200/20" },
                { icon: ShieldCheck, title: "Policy Alerts", desc: "Immediate notifications on new government subsidies and agricultural schemes.", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-200/20" }
              ].map((feature, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "glass-card border-0 group hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 overflow-hidden relative animate-[fade-in-up_0.6s_ease-out_forwards]",
                    feature.border,
                    idx === 0 && "stagger-1",
                    idx === 1 && "stagger-2",
                    idx === 2 && "stagger-3",
                    idx === 3 && "stagger-4"
                  )}
                  style={{ opacity: 0 }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity ${feature.bg.replace('/10', '/30')}`} />
                  <CardContent className="pt-10 pb-8 px-8 flex flex-col items-start text-left h-full relative z-10">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", feature.bg, feature.color)}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer py-16 border-t border-foreground/5 bg-white/50 dark:bg-black/20 backdrop-blur-md">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 max-w-xs">
            <Link className="flex items-center group" href="/">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-2">
                <Sprout className="text-primary h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tighter">AgriAlert</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the backbone of the nation with data-driven intelligence and timely alerts.
            </p>
            <p className="text-xs text-muted-foreground mt-4">© 2026 AgriAlert Systems.</p>
          </div>
          <nav className="flex gap-8 flex-wrap justify-center">
            <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
              Support
            </Link>
            <Link className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#">
              About Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

