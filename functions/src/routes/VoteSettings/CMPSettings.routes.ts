import {Router} from "express";
import {
    createCMP,
    getAllUserTypes,
    removeUserType,
    updateUserTypes
} from "../../common/models/Admin/VoteSettings/CMPSettings";
// import {auth} from "../../common/middleware/authentication";

const cmpSettingRouter = Router();

cmpSettingRouter.post("/createPerUserVote",  createCMP);
cmpSettingRouter.get("/getAllUserTypes",getAllUserTypes)
cmpSettingRouter.post("/removeUserType",  removeUserType);
cmpSettingRouter.put("/updateUserType",  updateUserTypes);


export default cmpSettingRouter;
