import { Router } from "express";


import {
    createFoundation,
    getFoundation,
    getFoundationList,
    updateFoundation,
    deleteFoundation,
    sendCPMToUserFoundation
} from "../common/models/Admin/Foundation";

const foundationRouter = Router();


foundationRouter.get("/getList", getFoundationList);
foundationRouter.post("/create", createFoundation);
foundationRouter.get("/get/:foundationId", getFoundation);
foundationRouter.patch("/update/:foundationId", updateFoundation);
foundationRouter.get("/delete", deleteFoundation);
foundationRouter.post("/sendPaxToUserFoundation", sendCPMToUserFoundation);


export default foundationRouter;
