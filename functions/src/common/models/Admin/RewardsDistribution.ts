import { firestore } from "firebase-admin";
import { errorLogging } from "../../helpers/commonFunction.helper";
//import _ from "lodash";


export const createRewardsDistribution = async (req: any, res: any) => {
  try {
    let rewardsDistributionData = req.body;

    await firestore()
      .collection("rewardsDistribution")
      .doc("distribution")
      .set(rewardsDistributionData, { merge: true });

    const getUpdatedRef = await firestore()
      .collection("rewardsDistribution")
      .doc("distribution")
      .get();
    const getUpdatedData = getUpdatedRef.data();

    res.status(200).send({
      status: true,
      message: "New reward distribution added successfully",
      result: getUpdatedData,
    });
  } catch (error) {
    errorLogging("createRewardsDistribution", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in createRewardsDistribution",
      result: error,
    });
  }
};

export const getAllRewardsDistribution = async (req: any, res: any) => {
  try {
    const getRewardsDistributionRef = await firestore()
      .collection("rewardsDistribution")
      .doc("distribution")
      .get();

    const getRewardsDistributionData = getRewardsDistributionRef.data();

    res.status(200).send({
      status: true,
      message: "Fatch all reward distribution successfully",
      result: getRewardsDistributionData ? getRewardsDistributionData : null,
    });
  } catch (error) {
    errorLogging(" getRewardsDistribution", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in  getRewardsDistribution",
      result: error,
    });
  }
};


