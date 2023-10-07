import { postTweetWithImage, uploadMedia } from "./twitter/apicalls.js";
import path from "path";

(async () => {
  try {
    // Resolve the image file path
    const imageFilePath = path.resolve("./testing_image.jpg");

    // Compose the tweet text
    const tweetText = "This is a test tweet with an image";

    // Post the tweet with the media
    const response = await postTweetWithImage(tweetText, imageFilePath); // pass the file path, not the file content

    // Log the successful tweet post response
    console.log("Tweet posted successfully:", response);
  } catch (error) {
    // Error handling: Log the error message
    console.error("Error:", error.message);
  }
})();
