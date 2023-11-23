import * as admin from "firebase-admin";
import env from "../../env/env.json";
import Busboy from "busboy";
import {
  getAlbumDetails,
  getCardDetails,
  updateFileLink,
  errorLogging,
} from "../models/Admin/Rewards";
import { logger } from "firebase-functions/v1";

export const imageUploadFunction = async (req: any, res: any) => {
  const { fileType, forModule, id } = req.params;

  try {
    const checkId =
      forModule.toUpperCase() === "CARD"
        ? await getCardDetails(id)
        : forModule.toUpperCase() === "ALBUM"
        ? await getAlbumDetails(id)
        : { albumName: "", cardName: "", message: true };
    if (checkId?.message) {
      return res.status(400).send({
        status: false,
        message: `only ${"CARD"} and ${"ALBUM"} are allowed`,
        result: null,
      });
    } else if (!checkId?.albumName && !checkId?.cardName) {
      return res.status(404).send({
        status: false,
        message: `This ID does not exist ${id} in ${forModule}`,
        result: null,
      });
    }
    const busboy = Busboy({ headers: req.headers });
    const bucket = admin.storage().bucket(env.STORAGE_BUCKET_URL);

    //On File Event
    busboy.on("file", (fieldname: any, file: any, fileMeta: any) => {
      const fileUpload = bucket.file(
        `${checkId.albumName}/${fileMeta.filename}`
      );
      const fileStream = file.pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: fileMeta.mimeType,
          },
        })
      );
      fileUpload
        .getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        })
        .then(async (signedUrls) => {
          console.log("Public Url ------\n", signedUrls[0]);
          const result = await updateFileLink(
            forModule,
            fileType,
            id,
            signedUrls[0]
          );
          return res.status(200).send({
            status: true,
            message: "Media uploaded and card image url updated successfully",
            result: { id, ...result },
          });
        });

      //On Error Event
      fileStream.on("error", (error: any) => {
        console.error("File Upload Error Event:", error);
        return res.status(500).send({
          status: true,
          message: "Unable to upload file",
          result: null,
        });
      });
    });

    // On Finish Event
    busboy.on("finish", async () => {
      console.info("On Finish Event Called");
    });
    busboy.end(req.rawBody);
  } catch (error) {
    errorLogging("uploadFiles", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const avatarUploadFunction = async (req: any, res: any) => {
  const { userId } = req.params;
  const { bio } = req.body;

  try {
    // upload the user's avatar
    const getUserDetails = (
      await admin.firestore().collection("users").doc(userId).get()
    ).data();
    const newFileName = getUserDetails?.displayName + userId;
    logger.warn("user details : ", getUserDetails);
    logger.warn("new file name : ", newFileName);

    const busboy = Busboy({ headers: req.headers });
    const bucket = admin.storage().bucket(env.STORAGE_BUCKET_URL);

    logger.info("Start uploading new file-------");

    busboy.on(
      "file",
      (
        fieldname: any,
        file: any,
        fileMeta: any,
      ) => {
        logger.log("File Meta : ", fileMeta);
        logger.log("File :", file);
        logger.log("fieldname : ", fieldname);

      

        const fileUpload =
          bucket.file(`UsersAvatar/${fileMeta.filename}`) ||
          bucket.file(`UsersAvatar/${newFileName}.png`);
        const fileStream = file.pipe(
          fileUpload.createWriteStream({
            metadata: {
              contentType: fileMeta.mimeType,
            },
          })
        );
        fileUpload
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then(async (signedUrls) => {
            console.log("Public Url ------\n", signedUrls[0]);

            await admin
              .firestore()
              .collection("users")
              .doc(userId)
              .set({ bio, avatar: signedUrls[0] }, { merge: true });

            const result = (
              await admin.firestore().collection("users").doc(userId).get()
            ).data();
            return res.status(200).send({
              status: true,
              message: "update avatar and bio successfully",
              result: { result },
            });
          });

        //On Error Event
        fileStream.on("error", (error: any) => {
          console.error("File Upload Error Event:", error);
          return res.status(500).send({
            status: true,
            message: "Unable to upload file",
            result: null,
          });
        });
      }
    );

    busboy.on("finish", async () => {
      // const downloadURL = await bucket
      //     .file(fileToBeUploaded.file)
      //     .publicUrl()
      // console.info("File Url", downloadURL);
      // return res.status(200).send({
      //     status: true,
      //     message: "Image uploaded and card image url updated successfully",
      //     result: { imageUrl: downloadURL },
      // });
    });
    busboy.end(req.rawBody);
  } catch (error) {
    errorLogging("uploadFiles", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};
