import io
import time
import base64
import logging
import multiprocessing

from elevenlabs import ElevenLabs

from src.environment_variables import ELEVEN_LABS_API_KEY
from src.environment_variables import ELEVEN_LABS_MODEL_NAME, ELEVEN_LABS_OUTPUT_FORMAT, ELEVEN_LABS_VOICE_ID


LOG = logging.getLogger(__name__)
ELEVEN_LABS_CLIENT = ElevenLabs(
    api_key=ELEVEN_LABS_API_KEY
)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def generate_text_chunks(text: str, chunk_size: int):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


def transcribe_text_to_audio(chunk_id: int, chunk: str):
    LOG.info("Starting Text to Audio Transcription.")
    audio = ELEVEN_LABS_CLIENT.text_to_speech.convert(
        text=chunk,
        model_id=ELEVEN_LABS_MODEL_NAME,
        voice_id=ELEVEN_LABS_VOICE_ID,
        output_format=ELEVEN_LABS_OUTPUT_FORMAT,
    )

    audio = b"".join(audio)
    LOG.info("Text to Audio Transcribed")
    return chunk_id, audio


async def stream_text_to_audio(
    model_response: str,
    chunk_size: int,
    number_workers: int
):
    results = {}
    number_of_workers = min(multiprocessing.cpu_count(), number_workers)
    chunked_text = generate_text_chunks(text=model_response, chunk_size=chunk_size)

    with multiprocessing.Pool(processes=number_of_workers) as pool:
        begin_time = time.perf_counter()
        tasks = [
            pool.apply_async(transcribe_text_to_audio, (index, chunk))
            for index, chunk in enumerate(chunked_text)
        ]

        try:
            for task in tasks:
                start_time = time.perf_counter()
                index, audio_chunk = task.get()
                tts_time = time.perf_counter() - start_time
                LOG.info(f"TTS response time for chunk_id: {index} = {tts_time}")

                results[index] = audio_chunk
        except Exception as e:
            LOG.error("Error raised. Check the input to the model.",e)

        LOG.info(f"Total time: {time.perf_counter() - begin_time}")

    for result in results.values():
        result_stream = io.BytesIO(result)
        yield result_stream.read()
