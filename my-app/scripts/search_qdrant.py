import os
import sys
import json
import hashlib
import requests
from qdrant_client import QdrantClient
from qdrant_client import models

# Load env variables
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
NVIDIA_API_KEY = "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"

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

def get_dense_embedding(query_text):
    url = "https://integrate.api.nvidia.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "input": [query_text],
        "model": "nvidia/llama-nemotron-embed-1b-v2",
        "input_type": "query",
        "dimensions": 1536
    }
    r = requests.post(url, headers=headers, json=payload, timeout=20)
    if r.status_code == 200:
        return r.json()["data"][0]["embedding"]
    else:
        raise RuntimeError(f"Embedding failed: {r.status_code} - {r.text}")

def get_sparse_vector(query_text):
    # Split query into words/tokens
    tokens = [t.lower().strip() for t in query_text.split() if t.strip()]
    
    # Map to token IDs
    token_map = {}
    for token in tokens:
        token_id = int(hashlib.md5(token.encode('utf-8')).hexdigest()[:8], 16) % 2147483647
        token_map[token_id] = 1.0
        
    sorted_indices = sorted(token_map.keys())
    sorted_values = [token_map[idx] for idx in sorted_indices]
    
    return {
        "indices": sorted_indices,
        "values": sorted_values
    }

def search(query_text, limit=5, category_filter=None):
    print(f"\nSearching for: '{query_text}'...")
    
    # 1. Generate dense & sparse query vectors
    dense_vec = get_dense_embedding(query_text)
    sparse_vec = get_sparse_vector(query_text)
    
    # 2. Build filter if provided
    query_filter = None
    if category_filter:
        query_filter = models.Filter(
            must=[
                models.FieldCondition(
                    key="main_category",
                    match=models.MatchValue(value=category_filter)
                )
            ]
        )
        
    # 3. Perform Hybrid Search
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        prefetch=[
            models.Prefetch(
                query=dense_vec,
                using="dense-vector",
                limit=50
            ),
            models.Prefetch(
                query=models.SparseVector(
                    indices=sparse_vec["indices"],
                    values=sparse_vec["values"]
                ),
                using="sparse-vector",
                limit=50
            )
        ],
        query=models.FusionQuery(
            fusion=models.Fusion.RRF
        ),
        query_filter=query_filter,
        limit=limit
    )
    
    print(f"Retrieved {len(results.points)} results:")
    for idx, point in enumerate(results.points):
        p = point.payload
        score = point.score
        print(f"{idx+1}. [{p.get('main_category')}] {p.get('title')} (Price: ${p.get('price')}, Score: {score:.4f})")
        print(f"   Tags: {p.get('tags')}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "running outdoor shoes"
        
    try:
        search(query)
    except Exception as e:
        print(f"Search failed: {e}")
