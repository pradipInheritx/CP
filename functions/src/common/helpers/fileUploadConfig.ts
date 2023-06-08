import * as admin from "firebase-admin"
import Busboy from 'busboy';

import { getAlbumDetails, getCardDetails, updateFileLink, errorLogging, } from "../models/Admin/Rewards";

// export const uploadFiles = async (req: any, res: any) => {
//     const { fileType, forModule, id } = req.params;

//     const checkId = (forModule == "card") ? await getCardDetails(id) : await getAlbumDetails(id);
//     console.log("checkId -------", checkId)
//     if (!checkId?.albumName && !checkId?.cardName) {
//         return res.status(404).send({
//             status: false,
//             message: `This id does not exist ${id} in ${forModule}`,
//             result: null,
//         });
//     }
//     try {
//         const getFileData = req.body.file.split(',');
//         const bucket = admin.storage().bucket('coin-parliament-staging.appspot.com');
//         console.info("bucket", bucket);

//         const imageBuffer = Buffer.from(getFileData[1], 'base64');

//         const filePath = `cards/${Date.now()}.jpg`
//         const file = bucket.file(filePath);
//         const imageByteArray: any = new Uint8Array(imageBuffer);
//         const options = { resumable: false, metadata: { contentType: "image/jpg" } }
//         file.save(imageByteArray, options)
//             .then(stuff => {
//                 console.info("file", file.metadata.mediaLink);
//                 updateFileLink(forModule, fileType, id, file.metadata.mediaLink)
//                 file.getSignedUrl({
//                     action: 'read',
//                     expires: '03-09-2500'
//                 })
//                 res.status(200).send({
//                     status: true,
//                     message: "Image uploaded and card image url updated successfully",
//                     result: { imageUrl: file.metadata.mediaLink },
//                 });
//             })
//             .catch(err => {
//                 return res.status(400).send({
//                     status: true,
//                     message: "Unable to upload image",
//                     result: null,
//                 });
//             })
//     } catch (error) {
//         errorLogging("uploadFiles", "ERROR", error);
//         res.status(500).send({
//             status: false,
//             message: "Something went wrong in server",
//             result: error,
//         });
//     }
// };



export const imageUploadFunction = async (req: any, res: any) => {

    const { fileType, forModule, id } = req.params;
    try {
        const checkId = (forModule == "card") ? await getCardDetails(id) : await getAlbumDetails(id);
        console.log("checkId -------", checkId)
        if (!checkId?.albumName && !checkId?.cardName) {
            return res.status(404).send({
                status: false,
                message: `This id does not exist ${id} in ${forModule}`,
                result: null,
            });
        }



        const busboy = Busboy({ headers: req.headers });
        let fileUpload: any;
        let fileToBeUploaded: any = {};
        const bucket = admin.storage().bucket("default-bucket")
        // const storage = new Storage();

        busboy.on('file', (fieldname: any, file: any, filename: any) => {

            fileToBeUploaded = { file: filename.filename, type: filename.mimeType };

            // Use your bucket name here
            fileUpload = bucket.file(filename.filename);
            const fileStream = file.pipe(fileUpload.createWriteStream({
                metadata: {
                    contentType: filename.mimeType,
                }
            }));

            fileStream.on('error', (err: any) => {
                console.log('Error(Img uipload): ', err);
                return res.status(400).send({
                    status: true,
                    message: "Unable to upload image",
                    result: null,
                });
                // res.status(200).send('Upload successful');
            });
        });

        busboy.on('finish', async () => {
            const downloadURL = await bucket
                .file(fileToBeUploaded.file)
                .publicUrl()
            updateFileLink(forModule, fileType, id, downloadURL)
            console.log("URL ------", downloadURL)
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
