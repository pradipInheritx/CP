import { Router } from "express";
import {
    signUp
} from "../common/models/User/GenericSignUp";

const userRouter = Router();

userRouter.post("/genericSignUp", signUp);

export default userRouter;
