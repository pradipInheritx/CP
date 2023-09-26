import * as admin from "firebase-admin";

export const getUserTypeSettings = async (req: any, res: any, next: any) => {
  try {
    const databaseQuery = await admin
      .firestore()
      .collection("settings").doc("userTypes")
      .get();

    const getAllUserTypeSettings: any = databaseQuery.data();
    console.info("DDD", getAllUserTypeSettings);

    if (!getAllUserTypeSettings.userTypes.length) {
      return res.status(404).send({
        status: true,
        message: "User type settings not found",
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "User type settings fetched successfully",
      result: getAllUserTypeSettings.userTypes,
    });
  } catch (error) {
    errorLogging("getUserTypeSettings", "GET", error)
    res.status(500).send({
      status: false,
      message: "Error while fetching user type settings",
      error: error,
    });
  }
};

export const updateUserTypeSettings = async (req: any, res: any, next: any) => {
  try {
    const { userTypes } = req.body;
    let databaseQuery = await admin.firestore().collection("settings").doc("userTypes");

    const updateAllUserTypeSettings: any = await databaseQuery.set({ userTypes }, { merge: true });

    let getAfterUpdate = await admin.firestore().collection("settings").doc("userTypes").get();

    res.status(200).send({
      status: true,
      message: "User type settings update successfully",
      result: {
        metadata: updateAllUserTypeSettings,
        data: getAfterUpdate.data(),
      },
    });
  } catch (error) {
    errorLogging("getUserTypeSettings", "GET", error)
    res.status(500).send({
      status: false,
      message: "Error while update user type",
      error: error,
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
