import { Router } from "express";

import {
    updatePushNotificationSetting,
    getAllPushNotificationSetting
} from "../common/models/Admin/PushNotificationSettings";

const PushNotificationSettingRouter = Router();

PushNotificationSettingRouter.patch("/updatePushNotificationSetting", updatePushNotificationSetting);
PushNotificationSettingRouter.get("/getAllPushNotificationSetting", getAllPushNotificationSetting);

export default PushNotificationSettingRouter;