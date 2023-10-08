import express from "express";
import { generateCompletion } from "./openai/apicalls.js";
import dotenv from "dotenv";
import { postTweetText, deleteTweet } from "./twitter/apicalls.js"; // Import deleteTweet too
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json()); // This allows you to parse incoming JSON payloads

app.get("/", (req, res) => {
  res.send("Welcome to my OpenAI-powered server!");
});

app.post("/generate-ad", async (req, res) => {
  try {
    const {
      name,
      industry,
      motto,
      businessDescription,
      advertisementImage,
      colors,
      designIdeas,
      adGoals,
      tone,
      keywords,
      webpageLink,
      platform,
    } = req.body;

    const prompt = `
      Business: ${name} (${industry})
      Motto: ${motto}
      Description: ${businessDescription}

      Visuals:
      Image: ${advertisementImage}
      Colors: ${colors}
      Design Ideas: ${designIdeas}

      Objective: 
      Goals: ${adGoals}
      Tone: ${tone}
      Keywords: ${keywords}

      Webpage: ${webpageLink}

      Generate a ${platform} post advertisement.
    `;

    const generatedPost = await generateCompletion(prompt);
    res.send(generatedPost);
  } catch (error) {
    res.status(500).send(`Error generating ad: ${error.message}`);
  }
});

app.post("/tweet", async (req, res) => {
  try {
    const tweetText = req.body.text;
    const response = await postTweetText(tweetText);
    res.send(response);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).send(`Error posting tweet: ${error.message}`);
  }
});

app.post("/tweetImageAd");

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

app.post("/tweetImage", async (req, res) => {
  try {
    const { text, imagePath } = req.body; // Get text and imagePath from the request body
    const response = await postTweetWithImage(text, imagePath); // Call postTweetWithImage with the text and imagePath
    res.send(response); // Send the response back to the client
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).send(`Error posting tweet with image: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
