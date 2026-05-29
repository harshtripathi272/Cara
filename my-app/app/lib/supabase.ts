import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  main_category: string;
  sub_categories: string[] | null;
  price: number | null;
  currency: string;
  average_rating: number | null;
  rating_count: number | null;
  image_url: string | null;
  features: string[] | null;
  in_stock: boolean;
  raw_details: Record<string, unknown> | null;
  created_at: string;
};
