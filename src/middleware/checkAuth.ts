import express from "express"
import {verifyJWToken} from "../utils";
import { DecodedData } from "../utils/verifyJWToken";


export default (req: any, res: express.Response, next: express.NextFunction): void => {

    if (
        req.path === "/user/login"
    ) {
        return next();
    }


    const token: any = req.headers.token

    verifyJWToken(token).then((user: DecodedData | null) => {
        req.user = user
        next()
    }).catch(() => {
        res.status(403).json({message: "Invalid auth token provided."})
    })
}