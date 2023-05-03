import { firestore } from "firebase-admin";
//import _ from "lodash";


export const createRewardsDistribution = async (req: any, res: any) => {

  try {
    await firestore()
      .collection("rewardsDistribution")
      .doc("distribution")
      .get();

    let rewardsDistributionData = {
      0: {
        cardTierPickingChanceInPercent: [90, 5, 3, 2, 0],
        extraVotePickFromRange: [1, 5],
        diamondsPickFromRange: [1, 3],
      }
    }

    const getUpdatedRewardsDistribution = await firestore()
      .collection("rewardsDistribution")
      .doc("distribution")
      .set(rewardsDistributionData, { merge: true });

    console.info("getUpdatedRewardsDistribution", getUpdatedRewardsDistribution);



    res.status(200).send({
      status: true,
      message: "New reward distribution added successfully",
      result: getUpdatedRewardsDistribution,
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

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};

