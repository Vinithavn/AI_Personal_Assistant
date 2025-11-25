import chromadb
# from chromadb.utils import embedding_functions

client = chromadb.Client()
collection = client.create_collection(name="messages")

def add_message_embedding(message:str,embedding:list[float],username:str,session_id:str,msg_id:str):
    user_session = f"{username}:{session_id}"

    collection.add(
        documents =[message],
        embeddings=[embedding],
        metadatas=[{"user_session": user_session}],
        ids = [msg_id]
    )

def query_similar_messages(query_embedding:list[float],username:str,session_id:str,n_results=5):
    results = collection.query(
        query_embeddings = [query_embedding],
        n_results=n_results,
        where={"user_session":f"{username}:{session_id}"}
    )
    # ChromaDB returns documents as a list of lists, flatten it
    documents = results.get("documents", [[]])
    if documents and len(documents) > 0:
        return [(doc,) for doc in documents[0]]  # Return as list of tuples for compatibility
    return []

