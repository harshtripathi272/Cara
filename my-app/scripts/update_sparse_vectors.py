import os
import sys
import time
import json

def load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()

load_env_file()

QDRANT_URL = "https://741cc024-1255-45e8-bba2-df921051fd89.eu-central-1-0.aws.cloud.qdrant.io"
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MTBhZDdkYTYtMDQ3Ny00NzhmLWFkMWYtZTFiMTExZDY5MDE1In0.YdPGKs1AH89fKk1ayKPgskHphfaPzk2_pyUmGjovZx0"
COLLECTION_NAME = "cara"

def main():
    from qdrant_client import QdrantClient, models
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, cloud_inference=True)
    
    # --- PHASE 1: COLLECT ALL POINT IDs AND TAGS ---
    print("PHASE 1: Fetching all point IDs and tags from Qdrant...")
    all_points = []
    next_page_offset = None
    batch_read_num = 0
    
    # We read in large batches of 500 to fetch quickly
    while True:
        batch_read_num += 1
        try:
            records, next_page_offset = client.scroll(
                collection_name=COLLECTION_NAME,
                limit=500,
                offset=next_page_offset,
                with_payload=True,
                with_vectors=False
            )
        except Exception as e:
            print(f"Error scrolling points: {e}. Retrying in 2 seconds...")
            time.sleep(2)
            continue
            
        if not records:
            break
            
        for r in records:
            payload = r.payload or {}
            tags = payload.get("tags") or []
            
            # Fallback tags if payload lacks them
            if not tags or not isinstance(tags, list):
                tags = []
                title = payload.get("title") or ""
                main_cat = payload.get("main_category") or ""
                if main_cat:
                    tags.append(main_cat)
                for word in title.split():
                    if len(word) > 2:
                        tags.append(word)
                        
            all_points.append({
                "id": r.id,
                "tags": tags
            })
            
        print(f"  Read batch {batch_read_num}: Collected {len(all_points)} points so far...")
        
        if next_page_offset is None:
            break
            
    total_points = len(all_points)
    print(f"\nPhase 1 Complete! Collected {total_points} total points.")
    
    if total_points == 0:
        print("No points found to update. Exiting.")
        return

    # --- PHASE 2: UPDATE SPARSE VECTORS IN BATCHES ---
    print("\nPHASE 2: Updating sparse vectors in batches of 100 using BM25 server-side inference...")
    batch_write_size = 100
    total_updated = 0
    start_time = time.time()
    
    for i in range(0, total_points, batch_write_size):
        sub_batch = all_points[i:i+batch_write_size]
        points_to_update = []
        
        for p in sub_batch:
            tags_text = ", ".join(p["tags"])
            if not tags_text.strip():
                tags_text = "product"
                
            points_to_update.append(
                models.PointVectors(
                    id=p["id"],
                    vector={
                        "sparse-vector": models.Document(
                            text=tags_text,
                            model="bm25"
                        )
                    }
                )
            )
            
        # Write batch updates
        try:
            client.update_vectors(
                collection_name=COLLECTION_NAME,
                points=points_to_update
            )
            total_updated += len(sub_batch)
            pct = (total_updated / total_points) * 100
            print(f"  Updated batch {i//batch_write_size + 1}/{total_points//batch_write_size + 1} | Progress: {total_updated}/{total_points} ({pct:.1f}%)")
        except Exception as e:
            print(f"  Error updating batch starting at index {i}: {e}. Retrying points individually...")
            for pt in points_to_update:
                try:
                    client.update_vectors(collection_name=COLLECTION_NAME, points=[pt])
                    total_updated += 1
                except Exception as ex:
                    print(f"    Failed to update point {pt.id}: {ex}")
                    
        # Small throttle delay
        time.sleep(0.05)
        
    elapsed = time.time() - start_time
    print(f"\n==========================================")
    print(f"Update Completed Successfully!")
    print(f"Total Points Processed: {total_points}")
    print(f"Total Points Updated:   {total_updated}")
    print(f"Time Elapsed:           {elapsed:.1f} seconds")
    print(f"==========================================")

if __name__ == "__main__":
    main()
