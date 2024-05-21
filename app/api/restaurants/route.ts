import { type NextRequest } from "next/server";

const SEARCH_ENDPOINT = "https://api.yelp.com/v3/businesses/search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { location, categories, price } = Object.fromEntries(
    searchParams.entries()
  );
  const finalParams = new URLSearchParams({
    location: location,
    term: "restaurants",
    categories: categories,
    price: price,
    sort_by: "best_match",
  });

  const res = await fetch(`${SEARCH_ENDPOINT}?` + finalParams, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
    },
  });

  const data = await res.json();

  return Response.json({ data });
}
