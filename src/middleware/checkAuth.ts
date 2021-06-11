import express from "express"
import {verifyJWToken} from "../utils";
import { DecodedData } from "../utils/verifyJWToken";


export default (req: any, res: express.Response, next: express.NextFunction): void => {

    if (
        req.path === "/user/login" ||
        req.path === "/user/registration"
    ) {
        return next();
    }


    const token = req.headers.token

    if (token) {
        verifyJWToken(token).then((user: DecodedData | null) => {
            if (user) {
                req.user = user.data._doc
            }
            next()
        }).catch(err => {
            res.status(403).json({message: "Invalid auth token provided."})
        })
    }
}