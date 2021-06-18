import express from "express"
import {MessageModel, DialogModel} from "../models"
import socket from "socket.io";

class MessageController {

    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = (req: express.Request, res: express.Response): void => {
        const dialogId: any = req.query.dialog

        MessageModel.find({dialog: dialogId})
            .populate(["dialog", "user", "attachments"])
            .exec(function (err: any, messages: any) {
                if (err) {
                    return res.status(404,).json({
                        message: "Messages not found"
                    })
                }
                return res.json(messages)
            })
    }


    create = (req: express.Request, res: express.Response): void => {

        // @ts-ignore
        const userId = req.user._id

        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: userId,
        }
        const message = new MessageModel(postData);

        message.save().then((obj: any) => {
            obj.populate(["dialog", "user", "attachments"],
                (err: any, message: any) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: err,
                        });
                    }
                    DialogModel.updateOne(
                        {_id: postData.dialog},
                        {lastMessage: message._id},
                        {upsert: true},
                        function (err) {
                            if (err) {
                                return res.status(500).json({
                                    status: "error",
                                    message: err,
                                })
                            }
                        }
                    )

                    res.json(message)
                    this.io.emit("SERVER:NEW_MESSAGE", message)
                })
        }).catch((reason: any) => {
            res.json(reason)
        })
    }

    delete = (req: express.Request, res: express.Response): void => {
        const id: any = req.query.id;
        // @ts-ignore
        const userId: string = req.user._id;

        MessageModel.findById(id, (err: any, message: any) => {
            if (err || !message) {
                return res.status(404).json({
                    status: "error",
                    message: "Message not found",
                });
            }

            if (message.user.toString() === userId) {
                const dialogId = message.dialog;
                message.remove();

                MessageModel.findOne(
                    { dialog: dialogId },
                    {},
                    { sort: { created_at: -1 } },
                    (err, lastMessage) => {
                        if (err) {
                            res.status(500).json({
                                status: "error",
                                message: err,
                            });
                        }

                        DialogModel.findById(dialogId, (err: any, dialog: any) => {
                            if (err) {
                                res.status(500).json({
                                    status: "error",
                                    message: err,
                                });
                            }

                            if (!dialog) {
                                return res.status(404).json({
                                    status: "not found",
                                    message: err,
                                });
                            }

                            dialog.lastMessage = lastMessage ? lastMessage.toString() : "";
                            dialog.save();
                        });
                    }
                );

                return res.json({
                    status: "success",
                    message: "Message deleted",
                });
            } else {
                return res.status(403).json({
                    status: "error",
                    message: "Not have permission",
                });
            }
        });
    };
}

export default MessageController