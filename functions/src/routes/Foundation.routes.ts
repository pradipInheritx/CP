import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    createFoundation,
    getFoundation,
    getFoundationList,
    updateFoundation,
    deleteFoundation
} from "../common/models/Admin/Foundation";

const foundationRouter = Router();


foundationRouter.get("/getList", getFoundationList);
foundationRouter.use(auth); //who api need authentication, put below otherwise put up

foundationRouter.post("/create", createFoundation);
foundationRouter.get("/get/:foundationId", getFoundation);
foundationRouter.patch("/update/:foundationId", updateFoundation);
foundationRouter.get("/delete", deleteFoundation);

export default foundationRouter;
