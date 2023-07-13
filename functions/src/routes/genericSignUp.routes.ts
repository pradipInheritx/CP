import { Router } from "express";
import {
    signUp
} from "../common/models/User/GenericSignUp";

const userRouter = Router();

userRouter.post("/generic-signup", signUp);

export default userRouter;
