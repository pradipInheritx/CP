import { Router } from "express";

import {
    userSignUp
} from "../common/models/User/GenericSignUp";

const userRouter = Router();

userRouter.post("/generic-signup", userSignUp);



export default userRouter;
