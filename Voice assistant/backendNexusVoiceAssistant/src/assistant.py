import time
import logging
from io import BytesIO
from openai import AzureOpenAI

from src.environment_variables import OPENAI_ENDPOINT, WHISPER_API_VERSION, GPT_MODEL_NAME
from src.environment_variables import AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY
from src.environment_variables import WHISPER_MODEL_NAME, OPENAI_API_KEY, GPT_MODEL_API_VERSION
from src.field_names import ROLE, USER, CONTENT, TYPE, IMAGE_URL, URL, TEXT, SYSTEM
from src.prompts import GPT_VOICE_ASSISTANT_PROMPT

from src.pinecone_connector import PineconeConnector

from src.field_names import METADATA, GPT_RESPONSE, PAGE_NUMBER

LOG = logging.getLogger(__name__)

IMAGE_BASE64_INITIAL_STRING = "data:image/jpeg;base64,"


class VoiceAssistant:
    def __init__(self, audio_data: BytesIO, window_context: str) -> None:
        self.audio_data = audio_data
        self.window_context = window_context
        self.pinecone_connector = PineconeConnector()

        self.azure_client = AzureOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_version=GPT_MODEL_API_VERSION,
            api_key=AZURE_OPENAI_API_KEY,
        )
        self.openai_client = AzureOpenAI(
            api_key=OPENAI_API_KEY,
            api_version=WHISPER_API_VERSION,
            azure_endpoint=OPENAI_ENDPOINT
        )

    async def start(self):
        start_time = time.perf_counter()
        textual_user_input: str = await self.transcribe_audio_to_text()
        whisper_time = time.perf_counter() - start_time
        LOG.info('Whisper response time: %f', whisper_time)

        pinecone_result = self.pinecone_connector.query_database(text=textual_user_input)
        if pinecone_result:
            LOG.info('Existing data found in pinecone database. Returning response from database.')
            return pinecone_result[0][METADATA][GPT_RESPONSE]
        else:
            start_time = time.perf_counter()
            gpt_response: str = await self.call_gpt(user_input=[
                {
                    TYPE: IMAGE_URL,
                    IMAGE_URL: {URL: f"{IMAGE_BASE64_INITIAL_STRING}{self.window_context}"},
                },
                {
                    TYPE: TEXT,
                    TEXT: textual_user_input,
                }
            ])
            gpt_time = time.perf_counter() - start_time
            LOG.info('GPT response time: %f', gpt_time)

            # self.pinecone_connector.upload_to_database(
            #     text=textual_user_input,
            #     metadata={
            #         GPT_RESPONSE: gpt_response,
            #         PAGE_NUMBER: ""
            #     },
            # )
            LOG.info("New data uploaded to pinecone successfully.")

            return gpt_response

    async def transcribe_audio_to_text(self) -> str:
        LOG.info("Starting Audio to Text Transcription.")
        transcription = self.openai_client.audio.transcriptions.create(
            model=WHISPER_MODEL_NAME,
            file=self.audio_data
        )
        LOG.info("Audio to Text Transcribed")
        return transcription.text

    async def call_gpt(self, user_input: list) -> str:
        LOG.info("Starting GPT Vision Understanding")
        response = self.azure_client.chat.completions.create(
            model=GPT_MODEL_NAME,
            messages=[
                {
                    ROLE: SYSTEM,
                    CONTENT: [
                        {
                            TYPE: TEXT,
                            TEXT: GPT_VOICE_ASSISTANT_PROMPT
                        }
                    ]
                },
                {
                    ROLE: USER,
                    CONTENT: user_input
                }
            ]
        )
        LOG.info("GPT Vision Response Generated")
        return response.choices[0].message.content
        