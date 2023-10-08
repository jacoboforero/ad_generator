import express from "express";
import { generateCompletion } from "./openai/apicalls.js";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";

import {
  postTweetText,
  deleteTweet,
  postTweetWithImage,
} from "./twitter/apicalls.js"; // Import deleteTweet too
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json()); // This allows you to parse incoming JSON payloads
app.use(cors({ origin: "http://localhost:5173" }));
app.get("/", (req, res) => {
  res.send("Welcome to my OpenAI-powered server!");
});

const upload = multer({ dest: "uploads/" });

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

app.post(
  "/submit-form",
  upload.single("advertisementImage"),
  async (req, res) => {
    try {
      const formData = req.body; // Assuming form data comes as a single string named formData
      const advertisementImage = req.file ? req.file.path : null;
      // Assuming the image comes as advertisementImage
      console.log(req.body);

      // Constructing the prompt as per your given format
      const prompt = `
      You are assuming the role of a marketing expert, and an expert at counting characters. You are tasked with creating a twitter post for a client. The client has filled out the following data about their company and product:

      ${JSON.stringify(req.body)}

      You are to create a high quality text for a twitter post to go along with the image the client provided. Twitter has a 250 character limit. Your response should be less than this. 
    `;

      // Generating the ad text
      const generatedContent = await generateCompletion(prompt);

      let tweetResponse;
      if (advertisementImage) {
        // If an image is provided, post the tweet with the image
        tweetResponse = await postTweetWithImage(
          generatedContent,
          advertisementImage
        );
      } else {
        // If no image is provided, post the tweet as text only
        tweetResponse = await postTweetText(generatedContent);
      }

      res.json({ message: "Tweet posted successfully!", tweetResponse });
    } catch (error) {
      console.error("Detailed error:", error);
      res.status(500).send(`Error processing form data: ${error.message}`);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
