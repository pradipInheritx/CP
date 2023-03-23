import * as firebaseAdmin from "firebase-admin";

export type perUserVoteProps = {
  quantity: string;
  pair: string;
  coin: string;
  createdBy: string;
  createdAt?: number;
};

export const createPerUserVote = async (req: any, res: any, next: any) => {
  try {
    const { quantity, pair, coin } = req.body;

    const perUserVoteData: perUserVoteProps = {
      quantity,
      pair,
      coin,
      createdBy: req.user.id,
      createdAt: firebaseAdmin.firestore.Timestamp.now().toMillis(),
    };

    const perUserVoteResponse = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("perUserVote")
      .add(perUserVoteData);

    const getPerUserVoteResponse = await perUserVoteResponse.get();

    res.status(201).send({
      status: true,
      message: "Per user vote created successfully. ",
      result: getPerUserVoteResponse.data(),
    });
  } catch (error) {
    errorLogging("createPerUserVote", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong while creating per user vote.",
      result: error,
    });
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
