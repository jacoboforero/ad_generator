import { postTweet, deleteTweet, uploadMedia } from "./twitter/apicalls.js";
import fs from "fs";

(async () => {
  try {
    //  Read the image file
    const imageFile = fs.createReadStream("./testing_image.jpg");

    //Upload the media to Twitter and get the mediaId
    const mediaId = await uploadMedia(imageFile);

    //Compose the tweet text
    const tweetText = "This is a test tweet with an image";

    // Post the tweet with the media
    const response = await postTweet(tweetText, mediaId);

    //Log the successful tweet post response
    console.log("Tweet posted successfully:", response);
  } catch (error) {
    // Error handling: Log the error message
    console.error("Error:", error.message);
  }
})();
