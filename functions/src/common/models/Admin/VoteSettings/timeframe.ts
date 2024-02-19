import * as firebaseAdmin from "firebase-admin";
import { errorLogging } from "../../../helpers/commonFunction.helper";

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
      .doc("timeframes")
      .get();

    const timeframes = getAllTimeframes.data()

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


export const updateTimeframe = async (req: any, res: any, next: any) => {
  try {
    console.info("req.body", req.body)

    await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("timeframes")
      .set(req.body, { merge: true })

    const getAllTimeframes = await firebaseAdmin
      .firestore()
      .collection("settings")
      .doc("timeframes")
      .get();

    const updatedTimeframes = getAllTimeframes.data()

    res.status(200).send({
      status: true,
      message: "Timeframes updated and fetched successfully",
      result: updatedTimeframes,
    });

  } catch (error) {
    errorLogging("updateTimeframe", "ERROR", error);
    res.status(500).send("Internal Server Error");
  }
};

