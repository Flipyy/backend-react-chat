import express from "express"
import {UserModel} from "../models";

export default (_: express.Request, __: express.Response, next: express.NextFunction) => {
    UserModel.findOneAndUpdate(
        {_id: "60bb897a786de8067463225e"},
        {fullname: "Elon Musk", last_seen: new Date()},
        {new: true},
        () => {}
    )
    next()
}