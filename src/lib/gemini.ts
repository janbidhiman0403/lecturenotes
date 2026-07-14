import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function processLecture(transcript: string) {
  const prompt = `
    Analyze the following lecture transcript and provide:
    1. A concise summary.
    2. A mindmap in Mermaid.js syntax.
    3. A relevant diagram (flowchart or sequence diagram) in Mermaid.js syntax.

    Transcript:
    ${transcript}

    Return the result in JSON format:
    {
      "summary": "string",
      "mindmapCode": "string",
      "diagramCode": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function transcribeAudio(audioBlob: Blob) {
  // In a real app, you'd send the blob. 
  // Here we'll simulate transcription for the demo as server-side multipart processing is complex.
  // However, we can use the model's multimodal capabilities if we have the file.
  
  // Since we are frontend only for Gemini calls, we need to convert blob to base64.
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.readAsDataURL(audioBlob);
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { inlineData: { mimeType: audioBlob.type, data: base64 } },
          { text: "Transcribe this lecture audio accurately. If it's a teacher's lecture, include key points." }
        ]
      }]
    });

    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    // Generic fallback if audio processing fails
    return "Error transcribing audio. Please try again with clearer sound.";
  }
}
