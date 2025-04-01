import logging

from pinecone import Pinecone

from src.environment_variables import PINECONE_API_KEY, PINECONE_INDEX_NAME, PINECONE_INDEX_ENDPOINT
from src.environment_variables import PINECONE_EMBEDDING_MODEL_NAME, THRESHOLD

from src.field_names import MATCHES

LOG = logging.getLogger(__name__)


class PineconeConnector:
    def __init__(self):
        self._connector = Pinecone(api_key=PINECONE_API_KEY)
        self._index_store = self._connector.Index(host=PINECONE_INDEX_ENDPOINT, name=PINECONE_INDEX_NAME)

    def query_database(self, text: str):
        embedded_text = self.embed_data(text=text)
        result = self._index_store.query(namespace="", vector=embedded_text, include_metadata=True, top_k=1)
        return list(filter(self.filter_by_score, result[MATCHES]))

    def embed_data(self, text: str):
        return self._connector.inference.embed(
            model=PINECONE_EMBEDDING_MODEL_NAME,
            inputs=text,
            parameters={
                "input_type": "passage",
                "truncate": "END"
            }
        ).embeddings_list.data[0]['values']

    def upload_to_database(self, text: str, metadata: dict):
        audio_id = str(int(list(self._index_store.list(namespace=""))[0][-1]) + 1)
        self._index_store.upsert_records(
            namespace="",
            records=[
                dict({
                    "_id": audio_id,
                    "text": text,
                }, **metadata)
            ],
        )
        LOG.info(f"Uploaded to pinecone database with ID: {audio_id}.")

    @staticmethod
    def filter_by_score(result):
        return result.score > THRESHOLD
