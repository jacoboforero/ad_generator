import { postTweet, deleteTweet } from "./twitter/apicalls.js"; // Import deleteTweet too
postTweet("Test tweet")
  .then((response) => {
    console.log("Success:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
