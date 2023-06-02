import * as admin from "firebase-admin"
import { getAlbumDetails, getCardDetails, updateFileLink, errorLogging, } from "../models/Admin/Rewards";

export const uploadFiles = async (req: any, res: any) => {
    const { fileType, forModule, id } = req.params;

    const checkId = (forModule == "card") ? await getCardDetails(id) : await getAlbumDetails(id);
    console.log("checkId -------", checkId)
    if (!checkId?.albumName && !checkId?.cardName) {
        return res.status(404).send({
            status: false,
            message: `This id does not exist ${id} in ${forModule}`,
            result: null,
        });
    }
    try {
        const getFileData = req.body.file.split(',');
        const bucket = admin.storage().bucket('default-bucket');
        console.info("bucket", bucket);

        const imageBuffer = Buffer.from(getFileData[1], 'base64');

        const filePath = `cards/${Date.now()}.jpg`
        const file = bucket.file(filePath);
        const imageByteArray: any = new Uint8Array(imageBuffer);
        const options = { resumable: false, metadata: { contentType: "image/jpg" } }
        file.save(imageByteArray, options)
            .then(stuff => {
                console.info("file", file.metadata.mediaLink);
                updateFileLink(forModule, fileType, id, file.metadata.mediaLink)
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2500'
                })
                res.status(200).send({
                    status: true,
                    message: "Image uploaded and card image url updated successfully",
                    result: { imageUrl: file.metadata.mediaLink },
                });
            })
            .catch(err => {
                return res.status(400).send({
                    status: true,
                    message: "Unable to upload image",
                    result: null,
                });
            })
    } catch (error) {
        errorLogging("uploadFiles", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
};
