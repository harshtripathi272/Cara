import os
from datasets import load_dataset

try:
    print("Trying to load Beauty_and_Personal_Care raw_meta with streaming=True...")
    dataset = load_dataset(
        "McAuley-Lab/Amazon-Reviews-2023",
        "raw_meta_Beauty_and_Personal_Care",
        trust_remote_code=True,
        streaming=True
    )
    print("Dataset loaded successfully. Getting iterator...")
    iterator = iter(dataset["full"])
    print("Getting first record...")
    first_record = next(iterator)
    print("First record keys:")
    print(first_record.keys())
    print("First record title:", first_record.get("title"))
except Exception as e:
    print("Error occurred:")
    import traceback
    traceback.print_exc()
