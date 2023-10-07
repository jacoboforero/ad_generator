import { generateCompletion } from "./openai/apicalls.js"; // Assuming you've renamed apicalls.js to apicalls.mjs

async function testAPI() {
  try {
    const prompt =
      "Translate the following English text to French: 'Hello, how are you?'";
    const response = await generateCompletion(prompt);
    console.log("API Response:", response);
  } catch (error) {
    console.error("Error calling the API:", error);
  }
}

testAPI();
