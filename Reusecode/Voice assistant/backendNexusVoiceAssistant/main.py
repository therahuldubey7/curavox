import base64
from io import BytesIO

import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from src.assistant import VoiceAssistant
from src.utilities import stream_text_to_audio


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_voice_assistant_response")
async def generate_voice_assistant_response(
    audio_file: UploadFile = File(...), 
    image_data: UploadFile = File(...)
):
    # Read and prepare the audio file
    audio_bytes: bytes = await audio_file.read()
    audio_data_buffer: BytesIO = BytesIO(audio_bytes)
    audio_data_buffer.name = "audio.wav"

    # Process the image file if provided; otherwise, set to an empty string.
    if image_data is not None:
        image_bytes: bytes = await image_data.read()
        image_base64_data = base64.b64encode(image_bytes).decode("utf-8")
    else:
        image_base64_data = ""

    voice_assistant = VoiceAssistant(audio_data=audio_data_buffer, window_context=image_base64_data)
    model_response = await voice_assistant.start()

    filename = "model_response.wav"
    headers = {'Content-Disposition': f'attachment; filename="{filename}"'}
    return StreamingResponse(
        stream_text_to_audio(model_response=model_response, chunk_size=25, number_workers=4), 
        media_type="audio/wav", headers=headers
    )


@app.get("/test_api")
def test_api(index: int, value: str):
    return {"index": index, "value": value}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
