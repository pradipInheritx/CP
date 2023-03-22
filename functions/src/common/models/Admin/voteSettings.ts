import * as firebaseAdmin from "firebase-admin";

export type voteSettingProps = {
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

    const voteTimeData: voteSettingProps = {
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
    errorLogging("createTimeframeForVoting", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong while creating the timeframe for voting",
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
