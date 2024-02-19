import { firestore } from "firebase-admin";
import * as jwt from "jsonwebtoken";
import * as env from "../../env/env.json";
import { errorLogging } from "../helpers/commonFunction.helper";
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
      return res.status(404).send({
        status: false,
        message: "User Not Found.",
        result: null,
      });
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
      return res.status(404).send({
        status: false,
        message: "User Not Found.",
        result: null,
      });
    }

    req.user = { id: getUser.id, ...getUser.data() };
    req.token = token;
    next();
  } catch (error) {
    errorLogging("logout", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
}

