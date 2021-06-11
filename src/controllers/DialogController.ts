import express from "express"
import {DialogModel, MessageModel} from "../models"


class DialogController {

    index(req: express.Request, res: express.Response): void {

        // @ts-ignore
        const authorId: any = req.user._id

        DialogModel.find({author: authorId})
            .populate(["author", "partner"])
            .exec(function (err: any, dialogs: any) {
                if (err) {
                    return res.status(404,).json({
                        message: "Dialogs not found"
                    })
                }
            return res.json(dialogs)
        })
    }


    create(req: express.Request, res: express.Response) {
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        }
        const dialog = new DialogModel(postData);
        dialog.save().then((dialogObj: any) => {
            const message = new MessageModel({
                text: req.body.text,
                user: req.body.author,
                dialog: dialogObj._id,
            })
            message.save().then(() => {
                res.json({
                    dialog: dialogObj,
                })

            }).catch((reason: any) => {
                res.json(reason)
            })
        }).catch((reason: any) => {
            res.json(reason)
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id
        DialogModel.findOneAndDelete({_id: id}).then((dialog: any) => {
            if (dialog) {
                res.json({
                    message: `Dialog deleted`
                })
            }
        })
            .catch((err: any) => {
                res.json(404).json({
                    message: "Dialog not found"
                })
            })
    }
}

export default DialogController