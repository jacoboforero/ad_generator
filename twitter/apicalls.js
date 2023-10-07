import axios from "axios";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import dotenv from "dotenv";
import FormData from "form-data";

import { Console } from "console";
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
  secret: process.env.TWITTER_SECRET_ACCESS_TOKEN, // User-specific Access Token Secret
};

const axiosInstance = axios.create();

export const postTweet = async (text, mediaId = null) => {
  const request_data = {
    url: "https://api.twitter.com/2/tweets",
    method: "POST",
    data: {
      text: text,
      ...(mediaId && { media: { media_ids: [mediaId] } }),
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
      data: request_data.data, // Changed this line to pass the entire data object
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

export async function uploadMedia(imageFile) {
  const formData = new FormData();
  formData.append("media", imageFile);

  try {
    const headers = {
      ...oauth.toHeader(
        oauth.authorize(
          {
            url: "https://upload.twitter.com/1.1/media/upload.json",
            method: "POST",
          },
          token
        )
      ),
      ...formData.getHeaders(),
    };

    const response = await axiosInstance.post(
      "https://upload.twitter.com/1.1/media/upload.json",
      formData,
      {
        headers,
      }
    );

    console.log(response.data);
    return response.data.media_id_string;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw new Error(`Error uploading media: ${error.message}`);
  }
}
