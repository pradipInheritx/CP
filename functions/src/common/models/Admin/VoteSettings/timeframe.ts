import * as firebaseAdmin from "firebase-admin";

export type timeframeProps = {
  chosen: boolean;
  index: number;
  name: string;
  seconds: number;
  createdBy: string;
  createdAt?: number;
};

export const createTimeframe = async (req: any, res: any, next: any) => {
  try {
    const { chosen, index, name, seconds } = req.body;

    const voteTimeData: timeframeProps = {
      chosen,
      index,
      name,
      seconds,
      createdBy: req.user.id,
      createdAt: firebaseAdmin.firestore.Timestamp.now().toMillis(),
    };

    const voteTimeDataResponse = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .add(voteTimeData);

    const getvoteTimeDataResponse = await voteTimeDataResponse.get();

    res.status(201).send({
      status: true,
      message: "Timeframe for voting created successfully. ",
      result: getvoteTimeDataResponse.data(),
    });
  } catch (error) {
    errorLogging("createTimeframe", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong while creating the timeframe.",
      result: error,
    });
  }
};

export const getTimeframe = async (req: any, res: any, next: any) => {
  try {
    const getAllTimeframes = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .get();

    const timeframes = getAllTimeframes.docs.map((doc: any) => ({
      timeframeId: doc.id,
      ...doc.data(),
    }));

    res.status(200).send({
      status: true,
      message: "Timeframes fetched successfully",
      result: timeframes,
    });
  } catch (error) {
    errorLogging("getTimeframe", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Error while fetching Timeframes:",
      error: error,
    });
  }
};

export const getTimeframeById = async (req: any, res: any, next: any) => {
  try {
    const { timeFrameId } = req.params;

    const databaseQuery = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .doc(timeFrameId)
      .get();

    const data = databaseQuery.data();

    if (!data) {
      return res.status(404).send({
        status: true,
        message: "Timeframe data not found",
        result: null
      });
    }
    res.status(200).send({
      status: true,
      message: "TimeFrame fetched successfully",
      result: {
        ...data,
        timeframeId: timeFrameId,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error while fetching TimeFrame:",
      error: error,
    });
  }
};

export const deleteTimeframeById = async (req: any, res: any, next: any) => {
  try {
    const { timeFrameId } = req.params;
    const timeframeRefRef = firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .doc(timeFrameId);

    if (!timeframeRefRef) {
      return res.status(404).send({
        status: true,
        message: "Timeframe data not found",
        result: null
      });
    }
    await timeframeRefRef.delete();
    res.status(200).send({
      status: true,
      message: "Timeframe deleted successfully.",
      result: null,
    });
  } catch (error) {
    errorLogging("deleteTimeframeById", "ERROR", error);
    res.status(500).send(error);
  }
};

export const updateTimeframe = async (req: any, res: any, next: any) => {
  try {
    const { chosen, index, name, seconds } = req.body;
    const { timeFrameId } = req.params;

    const databaseQuery = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .doc(timeFrameId)
      .get();

    const getTimeframeData: any = databaseQuery.data();
    if (!getTimeframeData) {
      return res.status(404).send({
        status: true,
        message: "Timeframe data not found",
        result: null
      });
    }

    const updatedTimeframeData = {
      chosen,
      index,
      name,
      seconds,
    };
    await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("voteSettings")
      .collection("timeframes")
      .doc(timeFrameId)
      .update(updatedTimeframeData);

    res.status(200).send({
      status: true,
      message: "Time frame updated successfully.",
      result: { id: timeFrameId, ...updatedTimeframeData },
    });
  } catch (error) {
    errorLogging("updateTimeframe", "ERROR", error);
    res.status(500).send("Internal Server Error");
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
