import express from "express"
import {MessageModel} from "../models"

class MessageController {

    index(req: express.Request, res: express.Response) {
        const dialogId: any = req.query.dialog

        MessageModel.find({dialog: dialogId})
            .populate(["dialog"])
            .exec(function (err: any, messages: any) {
                if (err) {
                    return res.status(404,).json({
                        message: "Messages not found"
                    })
                }
            return res.json(messages)
        })
    }


    create(req: express.Request, res: express.Response) {

        const userId = "60bb897a786de8067463225e"

        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: userId,
        }
        const message = new MessageModel(postData);
        message.save().then((obj: any) => res.json(obj)).catch((reason: any) => {
            res.json(reason)
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id
        MessageModel.findOneAndDelete({_id: id}).then((message: any) => {
            if (message) {
                res.json({
                    message: "Message deleted"
                })
            }
        })
            .catch((err: any) => {
                res.json(404).json({
                    message: "Message not found"
                })
            })
    }
}

export default MessageController