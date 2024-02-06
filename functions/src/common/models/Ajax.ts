import env from "../../env/env.json";
//import requestPromise from "request-promise";
import { VoteResultProps } from "../interfaces/Vote.interface";
import { messaging } from "firebase-admin";
import axios from "axios";

import {
  ICryptoSnapshotTickers,
  restClient,
  websocketClient,
} from "@polygon.io/client-js";

export const rest = restClient(env.polygon_api_key).crypto;
export const ws = websocketClient(env.polygon_api_key).crypto();

export function ajax_<T>(path: string): Promise<T> {
  const url = env.coinmarketcap_base + path;
  return axios.get(url, {
    headers: {
      "X-CMC_PRO_API_KEY": env.coinmarketcap_api_key,
    },
  })
  .then(response => response.data)
  .catch(error => {
    throw error.response ? error.response.data : error.message;
  });
}

export function snapshotAllTickers<T>(): Promise<ICryptoSnapshotTickers> {
  return rest.snapshotAllTickers();
}

export function fcm<T>(
  vote: VoteResultProps,
  token: string
): Promise<T> {
  const url = `https://fcm.googleapis.com/v1/projects/${env.react_app_firebase_project_id}/messages:send`;
  const topic = vote.userId;

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `key=${token}`,
  };

  const message: messaging.Message = {
    data: {
      vote: JSON.stringify(vote),
    },
    notification: {
      title: "Background Message Title",
      body: "Background message body",
    },
    topic,
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        body: "This is a message from FCM to web",
        requireInteraction: true,
      },
    },
  };

  return axios.post(url, message, {
    headers,
  })
  .then(response => response.data)
  .catch(error => {
    throw error.response ? error.response.data : error.message;
  });
}
