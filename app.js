import express from "express";
import { generateCompletion } from "./openai/apicalls.js";
import dotenv from "dotenv";
import { postTweet, deleteTweet } from "./twitter/apicalls.js"; // Import deleteTweet too
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json()); // This allows you to parse incoming JSON payloads

app.get("/", (req, res) => {
  res.send("Welcome to my OpenAI-powered server!");
});

app.post("/tweet", async (req, res) => {
  try {
    const tweetText = req.body.text;
    const response = await postTweet(tweetText);
    res.send(response);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).send(`Error posting tweet: ${error.message}`);
  }
});

app.delete("/tweet/:id", async (req, res) => {
  try {
    const tweetId = req.params.id;
    const response = await deleteTweet(tweetId);
    res.send(response);
  } catch (error) {
    res.status(500).send(`Error deleting tweet: ${error.message}`);
  }
});

app.get("/generate", async (req, res) => {
  try {
    let promptText = req.query.text;
    let generatedContent = await generateCompletion(promptText);
    res.send(generatedContent);
  } catch (error) {
    res.status(500).send(`Error generating completion: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});