import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from dotenv import load_dotenv
import speech_recognition as sr
import requests
from pydub import AudioSegment
from pydub.playback import play
import io

# Load API keys from the .env file
load_dotenv()

ELEVENLABS_API_KEY = "sk_f6b0b115047fcd612c4e082416b2ed30ff9c06b95a04af04"
ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

# Add this to debug
print("ElevenLabs API Key:", ELEVENLABS_API_KEY)
print("ElevenLabs Voice ID:", ELEVENLABS_VOICE_ID)

# Initialize the speech recognizer and microphone
recognizer = sr.Recognizer()
microphone = sr.Microphone()

# Initialize conversation history with a system prompt
conversation = [
    {"role": "system", "content": "You are a helpful voice assistant reply very brief, donot reply in markdown."}
]

def get_ai_response(user_input, model="gpt-4o-mini"):
    """Send the user input (with conversation history) to OpenAI and return the assistant's reply."""
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(model=model,
    messages=conversation,
    temperature=0.2,
    max_tokens=150)
    reply = response.choices[0].message.content.strip()
    conversation.append({"role": "assistant", "content": reply})
    return reply

def speak_text_elevenlabs(text):

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        audio = AudioSegment.from_file(io.BytesIO(response.content), format="mp3")
        play(audio)
    else:
        print("Error with ElevenLabs API:", response.status_code, response.text)

print("Voice Assistant is active. Say 'exit' to quit.\n")

while True:
    try:
        # Capture voice input
        with microphone as source:
            print("Listening...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)
        # Convert speech to text using Google's speech recognition
        user_input = recognizer.recognize_google(audio)
        print("You said:", user_input)

        if user_input.lower() == "exit":
            print("Goodbye!")
            speak_text_elevenlabs("Goodbye!")
            break

        # Get a response from the open AI
        reply = get_ai_response(user_input)
        print("Assistant:", reply)
        
        # Speak the AI's reply using ElevenLabs  
        speak_text_elevenlabs(reply)

    except sr.UnknownValueError:
        print("Sorry, I did not catch that. Please try again.")
    except sr.RequestError as e:
        print("Could not request results from the speech recognition service; {0}".format(e))
    except Exception as ex:
        print("An error occurred:", ex)
