from app.vectorstore.chroma_manager import collection

results = collection.get()

for meta in results["metadatas"]:
    print(meta)