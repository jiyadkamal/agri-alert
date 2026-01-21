"use client";

import AuthGuard from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { LogOut, MapPin, Newspaper, RefreshCw, ExternalLink, Droplets, Wind, Thermometer, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
    title: string;
    description: string;
    source: string;
    url: string;
    imageUrl: string;
    publishedAt: string;
}

interface WeatherData {
    location: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
    isDay?: boolean;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; location?: { state: string; district: string }; crops?: string[] } | null>(null);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [newsError, setNewsError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    // Fetch news function
    const fetchNews = useCallback((forceRefresh = false) => {
        if (!user?.crops || user.crops.length === 0) {
            setNewsLoading(false);
            return;
        }

        if (forceRefresh) setIsRefreshing(true);
        setNewsLoading(true);

        const cropsQuery = user.crops.slice(0, 3).join(" OR ");
        const stateQuery = user.location?.state || "";
        const refreshParam = forceRefresh ? "&refresh=true" : "";

        fetch(`/api/news?crops=${encodeURIComponent(cropsQuery)}&state=${encodeURIComponent(stateQuery)}${refreshParam}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setNewsError(data.error);
                } else {
                    setNews(data.articles || []);
                    setNewsError(null);
                }
            })
            .catch(() => {
                setNewsError("Failed to load news");
            })
            .finally(() => {
                setNewsLoading(false);
                setIsRefreshing(false);
            });
    }, [user]);

    // Fetch news on mount (uses cached data)
    useEffect(() => {
        if (user) {
            fetchNews(false);
        }
    }, [user, fetchNews]);

    // Fetch weather for user's district
    useEffect(() => {
        if (user?.location?.district) {
            fetch(`/api/weather?district=${encodeURIComponent(user.location.district)}&state=${encodeURIComponent(user.location.state || "")}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setWeather(data);
                    }
                })
                .catch(() => { })
                .finally(() => setWeatherLoading(false));
        } else {
            setWeatherLoading(false);
        }
    }, [user]);

    const handleRefresh = () => {
        fetchNews(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
                {/* Background Decorations with Animation*/}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-primary/8 to-agri-green/5 blur-[140px] -z-10 rounded-full animate-[pulse-glow_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-gradient-to-tr from-accent/8 to-primary/5 blur-[120px] -z-10 rounded-full animate-[pulse-glow_10s_ease-in-out_infinite_2s]" />

                {/* Header */}
                <header className="h-20 glass sticky top-0 z-50 flex items-center px-6 md:px-10 border-b-0 shadow-xl shadow-black/5">
                    <div className="flex items-center group cursor-pointer" onClick={() => router.push("/")}>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-agri-green rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <TrendingUp className="text-white h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">AgriAlert</span>
                    </div>

                    <div className="ml-auto flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold">{user.name}</span>
                            <span className="text-xs text-muted-foreground font-medium">{user.location?.district}, {user.location?.state}</span>
                        </div>
                        <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-xl glass border-foreground/5 hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-105 active:scale-95">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                Good Morning, <span className="text-primary">{user.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-primary/60" />
                                Tracking intelligence for <span className="text-foreground mx-1">{user.location?.district}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {user.crops?.map((crop) => (
                                <span key={crop} className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold border border-foreground/5 shadow-sm">
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Weather Section */}
                    <Card className="glass border-0 shadow-xl p-8 hover:scale-[1.01] transition-all duration-300" style={{ opacity: 0, animation: 'fade-in-up 0.5s ease-out 0.1s forwards' }}>
                        {weatherLoading ? (
                            <div className="flex items-center gap-6">
                                <Skeleton className="w-20 h-20 rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        ) : weather ? (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-200/20 backdrop-blur-sm">
                                        {/* Use API Icon */}
                                        <img
                                            src={weather.weather.icon}
                                            alt={weather.weather.description}
                                            className="w-20 h-20 object-contain drop-shadow-md"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-5xl font-black tracking-tight text-foreground">{weather.temperature}°</h3>
                                        <p className="text-xl font-medium text-muted-foreground capitalize mt-1">{weather.weather.description}</p>
                                        <p className="text-sm font-semibold text-primary mt-1 flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {weather.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 md:gap-12 bg-secondary/30 p-6 rounded-2xl border border-border/50">
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-2 bg-orange-500/10 rounded-full text-orange-500">
                                            <Thermometer className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Feels Like</p>
                                            <p className="text-lg font-bold">{weather.feelsLike}°</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                            <Droplets className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Humidity</p>
                                            <p className="text-lg font-bold">{weather.humidity}%</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <div className="p-2 bg-cyan-500/10 rounded-full text-cyan-500">
                                            <Wind className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Wind</p>
                                            <p className="text-lg font-bold">{weather.windSpeed} <span className="text-xs font-normal text-muted-foreground">m/s</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">Weather data unavailable</p>
                            </div>
                        )}
                    </Card>

                    {/* Main Content Area: News Feed */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight flex items-center">
                                <Newspaper className="mr-3 h-6 w-6 text-primary" /> Personalized News
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="font-bold"
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </Button>
                            </div>
                        </div>

                        {/* News Content */}
                        {newsLoading ? (
                            // Loading skeleton - 2 column grid
                            <div className="grid gap-4 md:grid-cols-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="glass border-0 shadow-lg p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <Skeleton className="h-4 w-24 rounded-full" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : newsError ? (
                            // Error state
                            <div className="rounded-2xl bg-destructive/5 border border-destructive/10 p-10 text-center">
                                <p className="text-destructive font-bold">Unable to load news</p>
                                <p className="text-sm text-muted-foreground mt-1">{newsError}</p>
                            </div>
                        ) : news.length === 0 ? (
                            // Empty state  
                            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-10 text-center">
                                <p className="text-primary font-bold">No news found</p>
                                <p className="text-sm text-muted-foreground mt-1">Try selecting different crops in your profile</p>
                            </div>
                        ) : (
                            // News articles - 2 column grid
                            <div className="grid gap-4 md:grid-cols-2">
                                {news.map((article, i) => (
                                    <a
                                        key={i}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Card className="glass border-0 shadow-lg p-6 h-full group cursor-pointer hover:bg-white/50 hover:shadow-xl transition-all border-l-4 border-l-primary/30 hover:border-l-primary">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start gap-4">
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{article.source}</span>
                                                    <span className="text-xs text-muted-foreground shrink-0">
                                                        {new Date(article.publishedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                {article.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                                                )}
                                                <div className="flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Read more <ExternalLink className="h-3 w-3 ml-1" />
                                                </div>
                                            </div>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </AuthGuard>
    );
}
