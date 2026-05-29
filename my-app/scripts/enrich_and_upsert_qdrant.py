import os
import sys
import json
import time
import hashlib
import requests

# Load env variables from .env.local
def load_env_file():
    # Look for .env.local in the root directory of my-app
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
    raise ValueError("Missing Supabase credentials in .env.local")

# Install dependencies if not present
try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase client...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
    from supabase import create_client, Client

try:
    from qdrant_client import QdrantClient
    from qdrant_client import models
except ImportError:
    print("Installing qdrant-client...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "qdrant-client"])
    from qdrant_client import QdrantClient
    from qdrant_client import models

# Qdrant Config
QDRANT_URL = "https://741cc024-1255-45e8-bba2-df921051fd89.eu-central-1-0.aws.cloud.qdrant.io"
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MTBhZDdkYTYtMDQ3Ny00NzhmLWFkMWYtZTFiMTExZDY5MDE1In0.YdPGKs1AH89fKk1ayKPgskHphfaPzk2_pyUmGjovZx0"
COLLECTION_NAME = "cara"

# NVIDIA NIM Config
NVIDIA_API_KEY = "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"
MODELS = [
    'meta/llama-3.1-8b-instruct',
    'meta/llama-3.2-3b-instruct',
    'meta/llama-3.3-70b-instruct',
    'meta/llama-3.1-70b-instruct'
]

# Initialize clients
print("Connecting to Supabase...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Connecting to Qdrant...")
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Progress Tracking file
PROGRESS_FILE = "migration_progress.json"

def get_last_offset():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, "r") as f:
                data = json.load(f)
                return data.get("offset", 0)
        except Exception:
            pass
    return 0

def save_progress(offset):
    try:
        with open(PROGRESS_FILE, "w") as f:
            json.dump({"offset": offset}, f)
    except Exception as e:
        print(f"Warning: Failed to save progress: {e}")

def parse_json_from_llm(content):
    content = content.strip()
    if content.startswith("```"):
        # Strip markdown code blocks
        lines = content.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content = "\n".join(lines).strip()
    try:
        return json.loads(content)
    except Exception:
        # Try regex to extract anything between { and }
        import re
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
        raise ValueError(f"Failed to parse JSON: {content[:200]}")

def get_heuristic_tags(p):
    tags = set()
    # Main category
    if p.get("main_category"):
        tags.add(p["main_category"].lower().strip())
    # Sub categories
    raw_details = p.get("raw_details") or {}
    categories = raw_details.get("categories") or []
    for cat in categories:
        tags.add(cat.lower().strip())
    # Features
    features = p.get("features") or []
    for feat in features:
        tags.add(feat.lower().strip()[:50])
    # Title words
    title = p.get("title") or ""
    stop_words = {"and", "or", "the", "for", "with", "a", "an", "in", "on", "at", "by", "of", "to", "renewed"}
    for word in title.lower().split():
        word_clean = ''.join(c for c in word if c.isalnum())
        if word_clean and word_clean not in stop_words and len(word_clean) > 2:
            tags.add(word_clean)
    return list(tags)[:20]

def generate_tags_for_sub_batch(sub_batch):
    # Formulate batch prompt
    prompt_parts = []
    for p in sub_batch:
        p_id = p["id"]
        title = p["title"] or ""
        main_cat = p["main_category"] or ""
        raw_details = p.get("raw_details") or {}
        categories = raw_details.get("categories") or []
        sub_cats = categories[1:] if len(categories) > 1 else categories
        desc = p["description"] or ""
        feats = p["features"] or []
        
        p_text = f"""Product ID: {p_id}
Title: {title}
Category: {main_cat} > {', '.join(sub_cats)}
Description: {desc[:600]}
Features: {', '.join(feats[:10])}"""
        prompt_parts.append(p_text)

    prompt = f"""You are a product tagging assistant for an e-commerce search engine.

Given the list of products below, generate 15-20 highly specific search tags for each.
Tags should cover: use case, occasion, material, style, gender, age group, 
mood/vibe, color (if mentioned), and product type.

Return ONLY a JSON object where the keys are the Product IDs and the values are JSON arrays of strings (the tags). Nothing else. Do not output any conversational text or markdown blocks, just the raw JSON object.

Products:
{chr(10).join(prompt_parts)}
"""

    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Try models in order of preference
    for model in MODELS:
        print(f"  Attempting tag generation using model: {model}...")
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 2048
        }
        for attempt in range(2):  # 2 retries per model
            try:
                r = requests.post(url, headers=headers, json=payload, timeout=45)
                if r.status_code == 200:
                    content = r.json()["choices"][0]["message"]["content"]
                    parsed = parse_json_from_llm(content)
                    if isinstance(parsed, dict):
                        return parsed
                elif r.status_code == 429:
                    print(f"    Model {model} rate limited (429). Sleeping 5s before retry...")
                    time.sleep(5)
                else:
                    print(f"    Model {model} failed with status {r.status_code}. Retrying...")
                    time.sleep(2)
            except Exception as e:
                print(f"    Model {model} encountered exception: {e}. Retrying...")
                time.sleep(2)
                
    # If all models failed, raise exception
    raise RuntimeError("All LLM models failed to generate tags.")

def generate_embeddings_batch(texts):
    url = "https://integrate.api.nvidia.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "input": texts,
        "model": "nvidia/llama-nemotron-embed-1b-v2",
        "input_type": "passage",
        "dimensions": 1536
    }
    for attempt in range(3):
        try:
            r = requests.post(url, headers=headers, json=payload, timeout=30)
            if r.status_code == 200:
                data = r.json()
                embs = sorted(data["data"], key=lambda x: x.get("index", 0))
                return [e["embedding"] for e in embs]
            elif r.status_code == 429:
                print(f"    Embeddings API rate limited (429). Sleeping 5s before retry...")
                time.sleep(5)
            else:
                print(f"    Embeddings API failed: {r.status_code} - {r.text}. Retrying...")
                time.sleep(2)
        except Exception as e:
            print(f"    Embeddings API exception: {e}. Retrying...")
            time.sleep(2)
    # Return zero vectors if failed completely
    return [[0.0] * 1536 for _ in texts]

def get_sparse_vector(tags):
    tokens = set()
    for tag in tags:
        tag_clean = tag.lower().strip()
        if not tag_clean:
            continue
        tokens.add(tag_clean)
        # Also split by space and add individual words
        for part in tag_clean.split():
            tokens.add(part.strip())
            
    # Map to token IDs and keep unique
    token_map = {}
    for token in tokens:
        if not token:
            continue
        # Deterministic 31-bit integer
        token_id = int(hashlib.md5(token.encode('utf-8')).hexdigest()[:8], 16) % 2147483647
        token_map[token_id] = 1.0
        
    # Qdrant sparse vectors must have indices sorted in ascending order
    sorted_indices = sorted(token_map.keys())
    sorted_values = [token_map[idx] for idx in sorted_indices]
    
    return {
        "indices": sorted_indices,
        "values": sorted_values
    }

def main():
    offset = get_last_offset()
    batch_size = 100
    sub_batch_size = 10
    
    print(f"Starting ingestion from offset: {offset}")
    
    while True:
        print(f"\n--- Fetching page from Supabase: offset={offset}, limit={batch_size} ---")
        try:
            res = supabase.table("products").select(
                "id, client_id, title, description, main_category, features, price, average_rating, in_stock, image_url, currency, raw_details"
            ).range(offset, offset + batch_size - 1).execute()
            
            products = res.data
            if not products:
                print("No more products found in Supabase. Migration complete!")
                break
                
            print(f"Retrieved {len(products)} products.")
            
            # Process in sub-batches of 20
            for i in range(0, len(products), sub_batch_size):
                sub_batch = products[i:i + sub_batch_size]
                print(f"Processing sub-batch {i//sub_batch_size + 1} of size {len(sub_batch)}...")
                
                # 1. Generate tags
                tags_map = {}
                try:
                    llm_tags = generate_tags_for_sub_batch(sub_batch)
                    for p in sub_batch:
                        p_id = p["id"]
                        if p_id in llm_tags and isinstance(llm_tags[p_id], list):
                            tags_map[p_id] = llm_tags[p_id]
                        else:
                            tags_map[p_id] = get_heuristic_tags(p)
                except Exception as e:
                    print(f"  Tag generation failed for sub-batch: {e}. Using heuristics.")
                    for p in sub_batch:
                        tags_map[p["id"]] = get_heuristic_tags(p)
                
                # 2. Generate embeddings
                tag_texts = []
                valid_sub_batch_products = []
                for p in sub_batch:
                    p_id = p["id"]
                    p_tags = tags_map.get(p_id, [])
                    if not p_tags:
                        p_tags = get_heuristic_tags(p)
                        tags_map[p_id] = p_tags
                    
                    tag_text = ", ".join(p_tags)
                    tag_texts.append(tag_text)
                    valid_sub_batch_products.append((p, p_tags))
                
                try:
                    dense_vectors = generate_embeddings_batch(tag_texts)
                except Exception as e:
                    print(f"  Embedding generation failed: {e}. Using zeros.")
                    dense_vectors = [[0.0] * 1536 for _ in tag_texts]
                
                # 3. Formulate points
                points = []
                for idx, (p, p_tags) in enumerate(valid_sub_batch_products):
                    p_id = p["id"]
                    dense_vec = dense_vectors[idx]
                    sparse_vec = get_sparse_vector(p_tags)
                    
                    # Convert fields safely
                    price = float(p["price"]) if p.get("price") is not None else None
                    rating = float(p["average_rating"]) if p.get("average_rating") is not None else None
                    in_stock = bool(p.get("in_stock", True))
                    
                    point = models.PointStruct(
                        id=p_id,
                        vector={
                            "dense-vector": dense_vec,
                            "sparse-vector": models.SparseVector(
                                indices=sparse_vec["indices"],
                                values=sparse_vec["values"]
                            )
                        },
                        payload={
                            "client_id": p.get("client_id") or "demo_client",
                            "title": p.get("title") or "",
                            "description": p.get("description") or "",
                            "main_category": p.get("main_category") or "",
                            "price": price,
                            "average_rating": rating,
                            "in_stock": in_stock,
                            "tags": p_tags,
                            "image_url": p.get("image_url") or "",
                            "currency": p.get("currency") or "USD"
                        }
                    )
                    points.append(point)
                
                # 4. Upsert to Qdrant
                try:
                    qdrant_client.upsert(
                        collection_name=COLLECTION_NAME,
                        points=points
                    )
                    print(f"  Successfully upserted {len(points)} points to Qdrant.")
                except Exception as e:
                    print(f"  Error during Qdrant upsert: {e}. Retrying points individually...")
                    for pt in points:
                        try:
                            qdrant_client.upsert(collection_name=COLLECTION_NAME, points=[pt])
                        except Exception as ex:
                            print(f"    Failed to upsert point {pt.id}: {ex}")
                
                # Enforce rate limiting throttling (sleep 1.5s)
                time.sleep(1.5)
            
            # Progress update per page
            offset += len(products)
            save_progress(offset)
            print(f"Successfully processed page. Progress saved at offset: {offset}")
            
        except Exception as e:
            print(f"Error processing page at offset {offset}: {e}. Waiting 10s and retrying...")
            time.sleep(10)

if __name__ == "__main__":
    main()
