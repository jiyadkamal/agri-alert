import { NextRequest, NextResponse } from "next/server";

// Cache news for 5 hours (18000 seconds)
export const revalidate = 18000;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const crops = searchParams.get("crops") || "";
    const state = searchParams.get("state") || "";
    const forceRefresh = searchParams.get("refresh") === "true";

    const gnewsKey = process.env.GNEWS_API_KEY;

    if (!gnewsKey) {
        return NextResponse.json(
            { error: "GNews API key not configured" },
            { status: 500 }
        );
    }

    // Parse crops from query
    const cropList = crops ? crops.split(" OR ").map(c => c.trim()).filter(Boolean) : [];

    // Build query based on user's selections
    let query = "";
    if (cropList.length > 0) {
        query = `${cropList.join(" OR ")} agriculture India`;
    } else if (state) {
        query = `${state} agriculture farming`;
    } else {
        query = "India agriculture farming news";
    }

    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&country=in&lang=en&max=10&token=${gnewsKey}`;

    try {
        // Use cache unless force refresh
        const fetchOptions = forceRefresh
            ? { cache: "no-store" as const }
            : { next: { revalidate: 18000 } }; // 5 hours

        const response = await fetch(gnewsUrl, fetchOptions);
        const data = await response.json();

        if (!response.ok) {
            console.error("GNews API Error:", data);
            return NextResponse.json({
                articles: [],
                query,
                error: data.errors?.[0] || "GNews API error",
                count: 0,
                cachedAt: new Date().toISOString()
            });
        }

        const articles = (data.articles || []).map((article: any) => ({
            title: article.title,
            description: article.description,
            source: article.source?.name,
            url: article.url,
            imageUrl: article.image,
            publishedAt: article.publishedAt,
            matchedCrop: cropList.find(c =>
                article.title?.toLowerCase().includes(c.toLowerCase()) ||
                article.description?.toLowerCase().includes(c.toLowerCase())
            ) || null,
        }));

        return NextResponse.json({
            articles,
            query,
            cropsSearched: cropList,
            count: articles.length,
            source: "GNews",
            cachedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("News API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch news", articles: [], count: 0 },
            { status: 500 }
        );
    }
}


