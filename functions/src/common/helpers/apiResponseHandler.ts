export function apiSuccessHandler(res: any, message: string, status: number = 200, data: any = {}) {
    // const msg = require(`../utils/lang/${lang}/message`);
    let msg = ""; //remove after importing the message file
    let obj = message.split('.');
    const keyName: any = obj[0];
    const subKey: any = obj[1];

    let resMessage = msg[keyName][subKey];

    return res ? res.status(status).json({
        success: true,
        message: resMessage,
        data: data
    }) : {
        status,
        success: true,
        message: resMessage,
        data: data
    };
}

export function apiErrorHandler(res: any, message: string, status :number = 500, result :any = null) {
    // const msg = require(`../utils/lang/${lang}/message`);
    let msg = ""; //remove after importing the message file
    let obj = message.split('.');
    const keyName: any = obj[0];
    const subKey: any = obj[1];

    let resMessage = msg[keyName][subKey];

    return res ? res.status(status).json({
        success: false,
        message: resMessage,
        result
    }) : {
        status,
        success: false,
        message: resMessage,
        result 
    };
}

// export function sendResponseValidation(res, status = 422, message, lang = 'en', replaceObj = {}) {
//     const msg = require(`../utils/lang/${lang}/validationMessage`);
//     let obj = message.split('.');
//     keyName = obj[0];
//     subKey = obj[1];
//     let resMessage = msg[keyName][subKey];

//     if (Object.keys(replaceObj).length !== 0) {
//         resMessage = replaceString(resMessage, replaceObj);
//     }

//     return res.status(status).json({
//         success: false,
//         message: resMessage
//     });
// }
