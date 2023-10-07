import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEngines() {
  try {
    const response = await openai.engines.list();
    console.log(response);
  } catch (error) {
    console.error("Error fetching engines:", error);
  }
}

async function generateCompletion(promptText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`Error generating completion: ${error.message}`);
  }
}

export { generateCompletion, getEngines };
