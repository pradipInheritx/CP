import {firestore, messaging} from "firebase-admin";
import {Direction, VoteResultProps} from "./Vote";
import {userConverter} from "./User";
import {sendNotification} from "./Notification";

export const subscribeToTopic: (token: string, userId: string) => void = (
    token: string,
    userId: string
) => {
  messaging()
      .subscribeToTopic([token], userId)
      .then(void 0)
      .catch((error) => {
        console.log("Error subscribing to topic:", error);
      });
};

export const unsubscribeToTopic: (token: string, userId: string) => void = (
    token: string,
    userId: string
) => {
  messaging()
      .unsubscribeFromTopic([token], userId)
      .then((response) => {
        console.log("Successfully unsubscribed from topic:", response);
      })
      .catch((error) => {
        console.log("Error unsubscribing from topic:", error);
      });
};

export const sendToTopic: (vote: VoteResultProps) => Promise<void> = async (
    vote: VoteResultProps
) => {
  const topic = vote.userId;

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

  await sendNotification({
    message,
    title: "Your leader has just voted",
    body: {
      body: "This is a message from FCM to web",
      requireInteraction: true,
    },
    id: vote.userId,
    token: topic,
  });
};

export const sendToTokens: (vote: VoteResultProps) => Promise<void> = async (
    vote: VoteResultProps
) => {
  const leader = vote.userId;
  const userRef = firestore()
      .collection("users")
      .doc(leader)
      .withConverter(userConverter);

  const userProps = await userRef.get();

  if (
    !userProps.data()?.subscribers ||
    !userProps.data()?.subscribers?.length
  ) {
    return;
  }
  const subscribers = await firestore()
      .collection("users")
      .where(
          firestore.FieldPath.documentId(),
          "in",
      userProps.data()?.subscribers
      )
      .withConverter(userConverter)
      .get();

  console.log(
      "going to send to subscribers:",
      subscribers.docs.map((s) => s.data().email)
  );

  const tokens: string[] = subscribers.docs
      .map((doc) => doc.data().token as string)
      .filter((t) => t);

  const name = userProps.data()?.displayName || userProps.data()?.email;

  if (tokens.length) {
    let body = `Your leader ${name} has voted on ${vote.coin}`;
    const [coin1, coin2] = vote.coin.split("-");
    if (coin2) {
      body += ` and chose ${vote.direction === Direction.BEAR ? coin2 : coin1}`;
    } else {
      body += ` and chose ${vote.direction}`;
    }

    const title = "Your leader has just voted";

    for (const token of tokens) {
      const message: messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
        },
      };

      await sendNotification({
        token,
        id: userProps.id,
        body,
        title,
        message,
      });
    }
  }
};
