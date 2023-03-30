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
    const {quantity, pair, coin} = req.body;

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

export const getPerUserVote = async (req: any, res: any, next: any) => {
  try {
    const getAllPerUserVotes = await firebaseAdmin
        .firestore()
        .collection("settings")
        .doc("voteSettings")
        .collection("perUserVote")
        .get();

    const getAllPerUserVotesResponse = getAllPerUserVotes.docs.map(
        (doc: any) => ({
          perUserVoteId: doc.id,
          ...doc.data(),
        })
    );
    res.status(200).send({
      status: true,
      message: "Per user votes fetched successfully",
      result: getAllPerUserVotesResponse,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error while fetching per user votes:",
      error: error,
    });
  }
};

export const getPerUserVoteById = async (req: any, res: any, next: any) => {
  try {
    const {perUserVoteId} = req.params;

    const databaseQuery = await firebaseAdmin
        .firestore()
        .collection("settings")
        .doc("voteSettings")
        .collection("perUserVote")
        .doc(perUserVoteId)
        .get();

    const data = databaseQuery.data();
    res.status(200).send({
      status: true,
      message: "per user vote fetched successfully",
      result: {
        ...data,
        perUserVoteId: perUserVoteId,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error while fetching per user vote:",
      error: error,
    });
  }
};

export const updatePerUserVoteById = async (req: any, res: any, next: any) => {
  try {
    const {quantity, pair, coin} = req.body;
    const {perUserVoteId} = req.params;

    const databaseQuery = await firebaseAdmin
        .firestore()
        .collection("settings")
        .doc("voteSettings")
        .collection("perUserVote")
        .doc(perUserVoteId)
        .get();

    const getPerUserVoteData: any = databaseQuery.data();
    console.log("getTimeframeData =>", getPerUserVoteData);

    const updatedPerUserVote = {
      quantity,
      pair,
      coin,
    };
    await firebaseAdmin
        .firestore()
        .collection("settings")
        .doc("voteSettings")
        .collection("perUserVote")
        .doc(perUserVoteId)
        .update(updatedPerUserVote);

    res.status(200).send({
      status: true,
      message: "Per user vote updated successfully.",
      result: updatedPerUserVote,
    });
  } catch (error) {
    errorLogging("updatePerUserVoteById", "ERROR", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deletePerUserVoteById = async (req: any, res: any, next: any) => {
  try {
    const {perUserVoteId} = req.params;
    const perUserVoteRef = firebaseAdmin
        .firestore()
        .collection("settings")
        .doc("voteSettings")
        .collection("perUserVote")
        .doc(perUserVoteId);

    await perUserVoteRef.delete();
    res.status(200).send({
      status: true,
      message: "Per user vote deleted successfully.",
      result: null,
    });
  } catch (error) {
    errorLogging("deletePerUserVoteById", "ERROR", error);
    res.status(500).send(error);
  }
};

export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
  console.info(funcName, type, error);
};
