import * as admin from "firebase-admin"
import Busboy from 'busboy';

import { getAlbumDetails, getCardDetails, updateFileLink, errorLogging, } from "../models/Admin/Rewards";

export const imageUploadFunction = async (req: any, res: any) => {

    const { fileType, forModule, id } = req.params;


    try {
        const checkId = forModule.toUpperCase() === "CARD" ? await getCardDetails(id)
            : forModule.toUpperCase() === "ALBUM" ? await getAlbumDetails(id)
                : { albumName: "", cardName: "", message: true };
        if (checkId?.message) {
            return res.status(400).send({
                status: false,
                message: `only ${"CARD"} and ${"ALBUM"} are allowed`,
                result: null,
            });
        }
        else if (!checkId?.albumName && !checkId?.cardName) {
            return res.status(404).send({
                status: false,
                message: `This ID does not exist ${id} in ${forModule}`,
                result: null,
            });
        }

        const busboy = Busboy({ headers: req.headers });

        const bucket = admin.storage().bucket("coin-parliament-staging.appspot.com")

        //On File Event
        busboy.on('file', (fieldname: any, file: any, fileMeta: any) => {

            const fileUpload = bucket.file(fileMeta.filename);
            const fileStream = file.pipe(fileUpload.createWriteStream({
                metadata: {
                    contentType: fileMeta.mimeType,
                }
            }));
            fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }).then(signedUrls => {
                console.log("Public Url ------\n", signedUrls[0]);
                updateFileLink(forModule, fileType, id, signedUrls[0]);
                return res.status(200).send({
                    status: true,
                    message: "Image uploaded and card image url updated successfully",
                    result: { id, imageUrl: signedUrls[0] },
                });
            });

            //On Error Event
            fileStream.on('error', (error: any) => {
                console.error('File Upload Error Event:', error);
                return res.status(500).send({
                    status: true,
                    message: "Unable to upload file",
                    result: null,
                });
            });
        });

        // On Finish Event
        busboy.on('finish', async () => {
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
}
