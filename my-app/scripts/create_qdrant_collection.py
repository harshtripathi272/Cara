import os
import sys

# Install qdrant-client if not present
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

print(f"Connecting to Qdrant at {QDRANT_URL}...")
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Check if collection already exists
try:
    collections = client.get_collections()
    existing_names = [c.name for c in collections.collections]
    print(f"Existing collections: {existing_names}")
    
    if COLLECTION_NAME in existing_names:
        print(f"Collection '{COLLECTION_NAME}' already exists. Deleting it to recreate with clean settings...")
        client.delete_collection(COLLECTION_NAME)
except Exception as e:
    print(f"Error checking collections: {e}")

print(f"Creating collection '{COLLECTION_NAME}' with dense (1536 dimensions, Cosine) and sparse (IDF enabled) vector configurations...")

try:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config={
            "dense-vector": models.VectorParams(
                size=1536,  # 1536 dimensions as requested
                distance=models.Distance.COSINE
            )
        },
        sparse_vectors_config={
            "sparse-vector": models.SparseVectorParams(
                modifier=models.Modifier.IDF
            )
        }
    )
    print(f"Successfully created collection '{COLLECTION_NAME}'!")
    
    # Create payload indexes
    print("Creating payload indexes...")
    
    # client_id (keyword)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="client_id",
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    
    # main_category (keyword)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="main_category",
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    
    # price (float)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="price",
        field_schema=models.PayloadSchemaType.FLOAT
    )
    
    # average_rating (float)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="average_rating",
        field_schema=models.PayloadSchemaType.FLOAT
    )
    
    # in_stock (bool)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="in_stock",
        field_schema=models.PayloadSchemaType.BOOL
    )
    
    # tags (keyword)
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="tags",
        field_schema=models.PayloadSchemaType.KEYWORD
    )
    
    print("Successfully created all payload indexes!")
    
except Exception as e:
    print(f"Failed during collection/index setup: {e}")
    import traceback
    traceback.print_exc()
