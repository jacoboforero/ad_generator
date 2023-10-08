import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import dotenv from "dotenv";
import { Console } from "console";
import FormData from "form-data";
import { TwitterApi } from "twitter-api-v2";
import fs from "fs";
dotenv.config();

// Initialize OAuth1.0a
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY, // Your API Key
    secret: process.env.TWITTER_API_SECRET, // Your API Secret
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_SECRET_ACCESS_TOKEN,
});

const token = {
  key: process.env.TWITTER_ACCESS_TOKEN, // User-specific Access Token
  secret: process.env.TWITTER_SECRET_ACCESS_TOKEN, // User-specific Access Token Secret
};

const axiosInstance = axios.create();

//posts a tweet

export const postTweetText = async (text) => {
  const request_data = {
    url: "https://api.twitter.com/2/tweets",
    method: "POST",
    params: {
      text: text,
    },
  };

  try {
    const response = await axiosInstance({
      url: request_data.url,
      method: request_data.method,
      headers: {
        ...oauth.toHeader(oauth.authorize(request_data, token)),
        "Content-Type": "application/json",
      },
      data: {
        text: text,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Detailed error:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error
    );
    throw new Error(
      `Error posting tweet: ${
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : error.message
      }`
    );
  }
};

export const postTweetWithImage = async (text, filePath) => {
  try {
    // First, upload the media to get a media_id
    const media_id_string = await uploadMedia(filePath);

    // Ensure media_ids is an array of strings
    const media_ids = [media_id_string];

    // Now post a tweet with the media_id and text
    const { data: createdTweet } = await client.v2.tweet(text, {
      media: {
        media_ids: media_ids, // Nest media_ids inside a media object
      },
    });

    // Log the successful tweet post response
    console.log("Tweet", createdTweet.id, ":", createdTweet.text);

    return createdTweet;
  } catch (error) {
    // Error handling: Log the error message
    console.error("Error:", error.message);
    throw new Error(`Error posting tweet: ${error.message}`);
  }
};

export const deleteTweet = async (tweetId) => {
  const request_data = {
    url: "https://api.twitter.com/2/tweets",
    method: "POST",
    params: {
      text: text,
    },
  };

  try {
    const response = await axios(request_data.url, {
      method: request_data.method,
      headers: {
        ...oauth.toHeader(oauth.authorize(request_data, token)),
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting tweet:",
      error.response ? error.response.data : error
    );
    throw new Error(
      `Error deleting tweet: ${
        error.response ? error.response.data.error : error.message
      }`
    );
  }
};

// Helper function to upload media to Twitter
export const uploadMedia = async (filePath) => {
  const form = new FormData();
  form.append("media", fs.createReadStream(filePath));

  const request_data = {
    url: "https://upload.twitter.com/1.1/media/upload.json",
    method: "POST",
  };

  try {
    const response = await axiosInstance({
      url: request_data.url,
      method: request_data.method,
      headers: {
        ...form.getHeaders(),
        ...oauth.toHeader(oauth.authorize(request_data, token)),
      },
      data: form,
    });

    return response.data.media_id_string; // Extract media_id from response
  } catch (error) {
    console.error(
      "Error uploading media:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error
    );
    throw new Error(
      `Error uploading media: ${
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : error.message
      }`
    );
  }
};
