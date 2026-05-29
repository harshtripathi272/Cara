import requests
import gzip
import json

url = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Beauty_and_Personal_Care.jsonl.gz"
print(f"Requesting {url} with stream=True...")
try:
    response = requests.get(url, stream=True)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    
    # Decompress gzip stream on the fly
    # We can use gzip.GzipFile with a file-like object wrapping the raw response stream
    raw = response.raw
    # GzipFile needs a file-like object. raw is a file-like object!
    with gzip.GzipFile(fileobj=raw) as g:
        for i in range(5):
            line = g.readline()
            if not line:
                break
            record = json.loads(line.decode('utf-8'))
            print(f"Record {i}: {record.get('title')[:60]}...")
except Exception as e:
    print("Error occurred:")
    import traceback
    traceback.print_exc()
