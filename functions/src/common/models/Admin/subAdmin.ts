import * as subAdmin from "firebase-admin";

export type subAdminProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  webAppAccess: string[];
  action?: string;
};

export const subAdminList = async (req: any, res: any, next: any) => {
  try {
    const databaseQuery = await subAdmin
      .firestore()
      .collection("subAdmin")
      .get();

    const getsubAdminList = databaseQuery.docs.map((doc) => {
      const getData = doc.data();
      return {
        id: doc.id,
        ...getData,
      };
    });

    res.status(200).send({
      status: true,
      message: "Sub admin fetched successfully",
      result: getsubAdminList,
    });
  } catch (error) {
    errorLogging("subAdminList", "ERROR", error);
    res.status(500).send(error);
  }
};

export const updateStatus = async (req: any, res: any, next: any) => {
  try {
    res.status(201).send({
      message: "Status update successfully. ",
    });
  } catch (error) {
    errorLogging("updateStatus", "ERROR", error);
    res.status(500).send(error);
  }
};

export const deleteSubAdmin = async (req: any, res: any, next: any) => {
  try {
    res.status(201).send({
      message: "Sub Admin deleted successfully. ",
    });
  } catch (error) {
    errorLogging("deleteSubAdmin", "ERROR", error);
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
