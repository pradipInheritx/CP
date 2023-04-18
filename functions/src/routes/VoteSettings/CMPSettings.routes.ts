import {Router} from "express";
import {
    createCMP,
    getAllUserTypes,
    removeUserType,

} from "../../common/models/Admin/VoteSettings/CMPSettings";
// import {auth} from "../../common/middleware/authentication";

const cmpSettingRouter = Router();

cmpSettingRouter.post("/createPerUserVote",  createCMP);
cmpSettingRouter.get("/getAllUserTypes",getAllUserTypes)
cmpSettingRouter.post("/removeUserType",  removeUserType);



export default cmpSettingRouter;
