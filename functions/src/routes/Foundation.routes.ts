import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    createFoundation,
    getFoundation,
    getFoundationList,
    updateFoundation,
    deleteFoundation
} from "../common/models/Admin/Foundation";

const foundatioRouter = Router();


foundatioRouter.use(auth); //who api need authentication, put below otherwise put up

foundatioRouter.post("/create", createFoundation);
foundatioRouter.get("/get/:foundationId", getFoundation);
foundatioRouter.get("/getList", getFoundationList);
foundatioRouter.get("/update/:foundationId", updateFoundation);
foundatioRouter.get("/delete", deleteFoundation);

export default foundatioRouter;
