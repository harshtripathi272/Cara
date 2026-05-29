"""
CARA Store - HuggingFace to Supabase Data Ingestion Script
==========================================================

Pulls product data from McAuley-Lab/Amazon-Reviews-2023 dataset
and inserts into Supabase products table.

Uses huggingface_hub to download raw JSONL files directly
(avoids deprecated loading scripts).

Usage:
  pip install huggingface_hub supabase
  python ingest_data.py
"""

import os
import json
import time
import requests
from supabase import create_client, Client

# -- Config --
def load_env_file():
    # Look for .env.local in the root directory
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()

load_env_file()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment or .env.local file.")

DATASET_REPO = "McAuley-Lab/Amazon-Reviews-2023"

# Map category name to the JSONL filename in the HF repo
CATEGORIES = {
    "raw_meta_Clothing_Shoes_and_Jewelry": "raw/meta_categories/meta_Clothing_Shoes_and_Jewelry.jsonl",
    "raw_meta_Electronics": "raw/meta_categories/meta_Electronics.jsonl",
    "raw_meta_Beauty_and_Personal_Care": "raw/meta_categories/meta_Beauty_and_Personal_Care.jsonl",
    "raw_meta_Home_and_Kitchen": "raw/meta_categories/meta_Home_and_Kitchen.jsonl",
    "raw_meta_Sports_and_Outdoors": "raw/meta_categories/meta_Sports_and_Outdoors.jsonl",
    "raw_meta_Health_and_Personal_Care": "raw/meta_categories/meta_Health_and_Personal_Care.jsonl",
}

RECORDS_PER_CATEGORY = 1000
BATCH_SIZE = 50
CLIENT_ID = "demo_client"
CURRENCY = "USD"

# -- Supabase Client --
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def extract_image_url(images):
    """Extract the best available image URL from the images field."""
    if not images:
        return None
    try:
        if isinstance(images, list):
            for img in images:
                if isinstance(img, dict):
                    for key in ["hi_res", "large", "thumb"]:
                        url = img.get(key)
                        if url and isinstance(url, str) and url.startswith("http"):
                            return url
                elif isinstance(img, str) and img.startswith("http"):
                    return img
        elif isinstance(images, dict):
            for key in ["hi_res", "large", "thumb"]:
                urls = images.get(key, [])
                if isinstance(urls, list):
                    for url in urls:
                        if url and isinstance(url, str) and url.startswith("http"):
                            return url
                elif isinstance(urls, str) and urls.startswith("http"):
                    return urls
    except Exception as e:
        print(f"  Warning: Failed to parse image: {e}")
    return None


def parse_price(price_val):
    """Parse price from various formats."""
    if price_val is None:
        return None
    if isinstance(price_val, (int, float)):
        return float(price_val) if price_val > 0 else None
    if isinstance(price_val, str):
        cleaned = price_val.strip().replace("$", "").replace(",", "").strip()
        if not cleaned:
            return None
        if " - " in cleaned or " to " in cleaned.lower():
            cleaned = cleaned.split(" - ")[0].split(" to ")[0].strip()
        try:
            val = float(cleaned)
            return val if val > 0 else None
        except ValueError:
            return None
    return None


def process_record(record):
    """Transform a HuggingFace record into a Supabase row."""
    title = record.get("title", "")
    if not title or not isinstance(title, str) or len(title.strip()) < 3:
        return None

    # Description - join list if needed
    desc = record.get("description", "")
    if isinstance(desc, list):
        desc = " ".join([str(d) for d in desc if d])
    elif not isinstance(desc, str):
        desc = str(desc) if desc else ""

    # Features
    features = record.get("features", [])
    if isinstance(features, list):
        features = [str(f) for f in features if f and isinstance(f, str)]
    else:
        features = []

    # Price
    price = parse_price(record.get("price"))

    # Rating
    avg_rating = record.get("average_rating")
    if isinstance(avg_rating, (int, float)) and avg_rating > 0:
        avg_rating = float(avg_rating)
    else:
        avg_rating = None

    # Rating count
    rating_count = record.get("rating_number")
    if isinstance(rating_count, (int, float)) and rating_count > 0:
        rating_count = int(rating_count)
    else:
        rating_count = None

    # Image URL
    image_url = extract_image_url(record.get("images"))

    # Main category
    main_category = record.get("main_category", "")
    if not isinstance(main_category, str):
        main_category = ""

    # Build raw_details jsonb
    try:
        raw_json = json.dumps(record, default=str)
        raw_details = json.loads(raw_json)
    except Exception:
        raw_details = {"title": title}

    return {
        "client_id": CLIENT_ID,
        "title": title.strip()[:500],
        "description": desc.strip()[:5000] if desc else None,
        "main_category": main_category.strip() if main_category else None,
        "features": features[:20] if features else None,
        "price": price,
        "currency": CURRENCY,
        "average_rating": avg_rating,
        "rating_count": rating_count,
        "image_url": image_url,
        "in_stock": True,
        "raw_details": raw_details,
    }


def ingest_category(category_name, filepath_in_repo, limit=RECORDS_PER_CATEGORY):
    """Stream and ingest one category from HuggingFace."""
    print(f"\n{'=' * 60}", flush=True)
    print(f"Streaming: {category_name}", flush=True)
    print("=" * 60, flush=True)

    url = f"https://huggingface.co/datasets/{DATASET_REPO}/resolve/main/{filepath_in_repo}"
    print(f"  URL: {url}", flush=True)

    inserted = 0
    skipped = 0
    batch = []

    # Retry parameters
    max_retries = 3
    retry_delay = 2

    for attempt in range(1, max_retries + 1):
        try:
            headers = {
                "Accept-Encoding": "gzip",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
            response = requests.get(url, headers=headers, stream=True)
            if response.status_code != 200:
                print(f"  ERROR: HTTP {response.status_code} fetching dataset (attempt {attempt}/{max_retries})", flush=True)
                if attempt < max_retries:
                    time.sleep(retry_delay * attempt)
                    continue
                return 0

            # response.iter_lines() handles line-by-line streaming/decompression
            for line in response.iter_lines():
                if not line:
                    continue
                if inserted >= limit:
                    break

                try:
                    record = json.loads(line.decode('utf-8'))
                except Exception:
                    continue

                row = process_record(record)
                if row is None:
                    skipped += 1
                    continue

                batch.append(row)

                if len(batch) >= BATCH_SIZE:
                    try:
                        supabase.table("products").insert(batch).execute()
                        inserted += len(batch)
                        print(f"  Inserted {inserted}/{limit} (skipped {skipped})", flush=True)
                    except Exception as e:
                        print(f"  ERROR inserting batch: {e}", flush=True)
                        # Fallback to inserting one-by-one to avoid skipping good rows on constraints
                        for single_row in batch:
                            try:
                                supabase.table("products").insert(single_row).execute()
                                inserted += 1
                            except Exception:
                                skipped += 1
                    batch = []
                    time.sleep(0.1)
            
            # If we successfully read and processed (or hit the limit), break out of retry loop
            break

        except Exception as e:
            print(f"  Connection error on attempt {attempt}/{max_retries}: {e}", flush=True)
            if attempt < max_retries:
                time.sleep(retry_delay * attempt)
            else:
                print(f"  All {max_retries} attempts failed.", flush=True)
                import traceback
                traceback.print_exc()

    # Insert remaining
    if batch:
        try:
            supabase.table("products").insert(batch).execute()
            inserted += len(batch)
            print(f"  Inserted {inserted}/{limit} (skipped {skipped})", flush=True)
        except Exception as e:
            print(f"  ERROR inserting final batch: {e}", flush=True)

    print(f"  Done: {inserted} records inserted, {skipped} skipped", flush=True)
    return inserted


def main():
    print("=" * 54, flush=True)
    print("  CARA Store -- HuggingFace Data Ingestion", flush=True)
    print("=" * 54, flush=True)
    print(f"\nSupabase URL: {SUPABASE_URL}", flush=True)
    print(f"Categories:   {len(CATEGORIES)}", flush=True)
    print(f"Per category: {RECORDS_PER_CATEGORY}", flush=True)
    print(f"Total target: ~{len(CATEGORIES) * RECORDS_PER_CATEGORY} records", flush=True)

    total_inserted = 0
    start_time = time.time()

    for category_name, filepath in CATEGORIES.items():
        count = ingest_category(category_name, filepath)
        total_inserted += count

    elapsed = time.time() - start_time
    print("\n" + "=" * 60, flush=True)
    print("COMPLETE", flush=True)
    print(f"  Total inserted: {total_inserted}", flush=True)
    print(f"  Time elapsed:   {elapsed:.1f}s", flush=True)
    print("=" * 60, flush=True)


if __name__ == "__main__":
    main()
