import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";
import * as jwt from "jsonwebtoken";
import * as env from "../../env/env.json";
interface JwtPayload {
    id: string
}


export async function auth(req: any, res: any, next: any) {
    try {
        const token = req.header('Authorization')?.toString().replace('Bearer ', '');
        // console.log("bearerToken----", token)
        if (!token) throw new functions.https.HttpsError("internal", 'User Not Found');
        const decodedToken: any = jwt.verify(token, env.JWT_AUTH_SECRET) as JwtPayload
        // console.log("decodedToken....", decodedToken.userAdmin.id)
        const user = await firestore()
            .collection('admin')
            .doc(decodedToken.userAdmin.id)
            .get()
        // console.log("Middleware ............. user ", user.data())
        if (!user.data()) throw new functions.https.HttpsError("internal", "User Not Found")
        req.user = user.data()
        req.token = token;
        next()

    } catch (error) {
        res.send(error)
    }

    // console.log("decodeedToken----", decodeedToken)


    // context.rawRequest.headers.authorization = String(decodeedToken);
    // return next(context)
}
