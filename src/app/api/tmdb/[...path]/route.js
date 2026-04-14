import redis from "@/lib/redis";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getTTL(path) {
  if (path.includes("/search/")) return 300; // 5 min
  if (/\/(movie|tv)\/\d+/.test(path)) return 21600; // 6 hours (details)
  return 1800; // 30 min (lists, trending, discover)
}

export async function GET(request, { params }) {
  const { path } = await params;
  const tmdbPath = path.join("/");
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  const tmdbUrl = query
    ? `${TMDB_BASE}/${tmdbPath}?${query}`
    : `${TMDB_BASE}/${tmdbPath}`;

  const cacheKey = `tmdb:${tmdbPath}?${query}`;

  // Try Redis cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return Response.json(cached, {
          headers: { "X-Cache": "HIT" },
        });
      }
    } catch {
      // Redis down — fall through to TMDB
    }
  }

  // Fetch from TMDB
  const res = await fetch(tmdbUrl, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIEDB_API_KEY}`,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return new Response(res.statusText, { status: res.status });
  }

  const data = await res.json();

  // Cache in Redis
  if (redis) {
    try {
      const ttl = getTTL(tmdbPath);
      await redis.set(cacheKey, data, { ex: ttl });
    } catch {
      // Redis down — response still served
    }
  }

  return Response.json(data, {
    headers: { "X-Cache": "MISS" },
  });
}
