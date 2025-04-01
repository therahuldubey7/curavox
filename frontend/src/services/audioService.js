import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const audioService = {
  async sendAudio(audioBlob, role, symptoms) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("role", role);
      formData.append("symptoms", JSON.stringify(symptoms));

      const response = await axios.post(
        `${API_BASE_URL}/api/simulate-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Important for receiving audio response
        }
      );

      return response.data;
    } catch (error) {
      console.error("Audio API error:", error);
      throw new Error("Failed to process audio. Please try again.");
    }
  },
};
