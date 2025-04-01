import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from dotenv import load_dotenv
import speech_recognition as sr
import pyttsx3

# Load API keys from .env file
load_dotenv()

# Initialize the speech recognizer and microphone
recognizer = sr.Recognizer()
microphone = sr.Microphone()

# Initialize the text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)   # Speech rate (words per minute)
engine.setProperty('volume', 1.0) # Volume (0.0 to 1.0)

# Initialize conversation history with a system prompt
conversation = [
    {"role": "system", "content": "You are a helpful voice assistant that answers code and tech questions."}
]

def get_ai_response(user_input, model="gpt-4o-mini"):
    """Send the user input along with the conversation history to the OpenAI API and return the reply."""
    conversation.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(model=model,
    messages=conversation,
    temperature=0.2,
    max_tokens=150)
    reply = response.choices[0].message.content.strip()
    conversation.append({"role": "assistant", "content": reply})
    return reply

def speak_text(text):
    """Use pyttsx3 to speak the provided text."""
    engine.say(text)
    engine.runAndWait()

print("Voice Assistant is active. Say 'exit' to quit.")

while True:
    try:
        # Listen for voice input from the microphone
        with microphone as source:
            print("\nListening...")
            recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
            audio = recognizer.listen(source)

        # Transcribe the audio to text using Google's Speech Recognition
        user_input = recognizer.recognize_google(audio)
        print("You said:", user_input)

        # Exit if the user says "exit"
        if user_input.lower() == "exit":
            print("Goodbye!")
            speak_text("Goodbye!")
            break

        # Get a response from the AI
        reply = get_ai_response(user_input)
        print("Assistant:", reply)

        # Speak the assistant's reply
        speak_text(reply)

    except sr.UnknownValueError:
        print("Sorry, I did not catch that. Please try again.")
    except sr.RequestError as e:
        print("Could not request results from the speech recognition service; {0}".format(e))
    except Exception as ex:
        print("An error occurred:", ex)
