import { supabase, Product } from "./supabase";

export type SortOption =
  | "relevancy"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest";

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ data: Product[]; count: number }> {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    minRating,
    sort = "relevancy",
    page = 1,
    limit = 24,
  } = filters;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (category) {
    query = query.eq("main_category", category);
  }

  if (search) {
    query = query.textSearch("search_vector", search, {
      type: "websearch",
      config: "english",
    });
  }

  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  if (minRating !== undefined) {
    query = query.gte("average_rating", minRating);
  }

  // Filter out products without images for better UX
  query = query.not("image_url", "is", null);

  // Sort
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    case "rating":
      query = query.order("average_rating", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("rating_count", {
        ascending: false,
        nullsFirst: false,
      });
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }

  return { data: (data as Product[]) || [], count: count || 0 };
}

export async function searchProducts(
  query: string,
  limit: number = 20
): Promise<Product[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .textSearch("search_vector", query, {
      type: "websearch",
      config: "english",
    })
    .not("image_url", "is", null)
    .limit(limit);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return (data as Product[]) || [];
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("main_category")
    .not("main_category", "is", null)
    .not("image_url", "is", null);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  const categories = [
    ...new Set((data || []).map((d: { main_category: string }) => d.main_category)),
  ];
  return categories.filter(Boolean).sort();
}

export async function getTopProducts(
  category?: string,
  limit: number = 10
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .not("image_url", "is", null)
    .order("rating_count", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (category) {
    query = query.eq("main_category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching top products:", error);
    return [];
  }

  return (data as Product[]) || [];
}

export async function getFeaturedProducts(
  limit: number = 10
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("image_url", "is", null)
    .gte("average_rating", 4.0)
    .order("rating_count", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (data as Product[]) || [];
}

export async function getNewArrivals(
  limit: number = 10
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }

  return (data as Product[]) || [];
}

export async function getCategoryProductCounts(): Promise<
  { category: string; count: number }[]
> {
  const { data, error } = await supabase
    .from("products")
    .select("main_category")
    .not("main_category", "is", null)
    .not("image_url", "is", null);

  if (error) return [];

  const counts: Record<string, number> = {};
  (data || []).forEach((d: { main_category: string }) => {
    counts[d.main_category] = (counts[d.main_category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
