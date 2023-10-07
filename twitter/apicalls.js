import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import dotenv from "dotenv";
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

const token = {
  key: process.env.TWITTER_ACCESS_TOKEN, // User-specific Access Token
  secret: process.env.TWITTER_ACCESS_TOKEN_SECRET, // User-specific Access Token Secret
};

const axiosInstance = axios.create();

export const postTweet = async (text) => {
  const request_data = {
    url: "https://api.twitter.com/1.1/statuses/update.json",
    method: "POST",
    data: { status: text },
  };

  try {
    const response = await axiosInstance(request_data.url, {
      method: request_data.method,
      headers: {
        ...oauth.toHeader(oauth.authorize(request_data, token)),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `status=${encodeURIComponent(text)}`,
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
          ? error.response.data.error || JSON.stringify(error.response.data)
          : error.message
      }`
    );
  }
};

export const deleteTweet = async (tweetId) => {
  const request_data = {
    url: `https://api.twitter.com/1.1/statuses/destroy/${tweetId}.json`,
    method: "POST",
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
    throw new Error(
      `Error deleting tweet: ${
        error.response ? error.response.data.error : error.message
      }`
    );
  }
};

// ... rest of your code
