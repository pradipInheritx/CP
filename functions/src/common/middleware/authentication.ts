import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as jwt from "jsonwebtoken";
import * as env from "../../env/env.json";
interface JwtPayload {
  id: string;
}

export async function auth(req: any, res: any, next: any) {
  try {
    const token = req
        .header("Authorization")
      ?.toString()
      .replace("Bearer ", "");
    if (!token) {
      throw new functions.https.HttpsError("internal", "User Not Found");
    }

    const decodedToken: any = jwt.verify(
        token,
        env.JWT_AUTH_SECRET
    ) as JwtPayload;

    const getUser = await firestore()
        .collection("admin")
        .doc(decodedToken.userAdmin.id)
        .get();

    if (!getUser.data()) {
      throw new functions.https.HttpsError("internal", "User Not Found");
    }

    req.user = {id: getUser.id, ...getUser.data()};
    req.token = token;
    next();
  } catch (error) {
    res.send(error);
  }
}
