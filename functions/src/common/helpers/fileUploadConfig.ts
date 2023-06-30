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
        let fileUpload: any;
        let fileToBeUploaded: any = {};
        const bucket = admin.storage().bucket("coin-parliament-staging.appspot.com")

        //On File Event
        busboy.on('file', (fieldname: any, file: any, fileMeta: any) => {
            fileToBeUploaded = { file: fileMeta.filename, type: fileMeta.mimeType };

            fileUpload = bucket.file(fileMeta.filename);
            const fileStream = file.pipe(fileUpload.createWriteStream({
                metadata: {
                    contentType: fileMeta.mimeType,
                }
            }));

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
            const downloadURL = await bucket
                .file(fileToBeUploaded.file)
                .publicUrl()
            updateFileLink(forModule, fileType, id, downloadURL);

            console.info("File Url", downloadURL);

            return res.status(200).send({
                status: true,
                message: "Image uploaded and card image url updated successfully",
                result: { imageUrl: downloadURL },
            });
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
