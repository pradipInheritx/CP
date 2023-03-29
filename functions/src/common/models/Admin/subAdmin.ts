import * as admin from "firebase-admin";

export type subAdminProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  webAppAccess: string[];
  action?: string;
};

export const subAdminList = async (req: any, res: any, next: any) => {
  try {
    const { adminId } = req.params;
    let { page = 1, limit = 5 } = req.query;
    limit = parseInt(limit);

    const databaseQuery = await admin
      .firestore()
      .collection("admin")
      .where("adminUserId", "==", adminId)
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const subAdminList = databaseQuery.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    res.status(200).send({
      status: true,
      message: "Sub-admins fetched successfully",
      result: subAdminList,
    });
  } catch (error) {
    console.error("Error while fetching sub-admins: ", error);
    res.status(500).send({
      status: false,
      message: "Error fetching sub-admins",
      error: error,
    });
  }
};

export const updateStatus = async (req: any, res: any, next: any) => {
  try {
    const { status } = req.body;
    const { subAdminId } = req.params;
    const databaseQuery = await admin
      .firestore()
      .collection("admin")
      .doc(subAdminId)
      .get();

    const getSubAdminData: any = databaseQuery.data();
    getSubAdminData.status = status;

    const statusUpdate = await admin
      .firestore()
      .collection("admin")
      .doc(subAdminId)
      .set(getSubAdminData);

    const databaseQueryAfterUpdate = await admin
      .firestore()
      .collection("admin")
      .doc(subAdminId)
      .get();

    res.status(200).send({
      status: true,
      message: "Status updated successfully.",
      result: {
        metadata: statusUpdate,
        data: { id: subAdminId, ...databaseQueryAfterUpdate.data() },
      },
    });
  } catch (error) {
    errorLogging("updateStatus", "ERROR", error);
    res.status(500).send(error);
  }
};

export const deleteSubAdmin = async (req: any, res: any, next: any) => {
  try {
    const { subAdminId } = req.params;
    const subAdminRef = admin.firestore().collection("admin").doc(subAdminId);
    await subAdminRef.delete();
    res.status(200).send({
      status: true,
      message: "Sub Admin deleted successfully.",
      result: null,
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
