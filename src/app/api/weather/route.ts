import { NextRequest, NextResponse } from "next/server";

// Cache weather for 30 minutes
export const revalidate = 1800;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const district = searchParams.get("district") || "";
    const state = searchParams.get("state") || "";

    const apiKey = process.env.WEATHERAPI_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Weather API key not configured" },
            { status: 500 }
        );
    }

    if (!district) {
        return NextResponse.json(
            { error: "District is required" },
            { status: 400 }
        );
    }

    // Build location query
    const location = state ? `${district} ${state} India` : `${district} India`;

    try {
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
        const response = await fetch(weatherUrl, { next: { revalidate: 1800 } });

        if (!response.ok) {
            const error = await response.json();
            console.error("WeatherAPI Error:", error);
            return NextResponse.json({
                error: error.error?.message || "Failed to fetch weather",
                location
            }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json({
            location: data.location?.name,
            region: data.location?.region,
            country: data.location?.country,
            temperature: Math.round(data.current?.temp_c),
            feelsLike: Math.round(data.current?.feelslike_c),
            humidity: data.current?.humidity,
            windSpeed: Math.round((data.current?.wind_kph || 0) * 1000 / 3600), // Convert kph to m/s
            weather: {
                main: data.current?.condition?.text,
                description: data.current?.condition?.text,
                icon: "https:" + data.current?.condition?.icon // WeatherAPI returns partial URL
            },
            isDay: data.current?.is_day === 1,
            lastUpdated: data.current?.last_updated,
            cachedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Weather API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch weather" },
            { status: 500 }
        );
    }
}
