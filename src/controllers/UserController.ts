import express from "express"
import {UserModel} from "../models"
import {IUser} from "../models/User"
import {createJWToken} from "../utils";

class UserController {
    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id
        UserModel.findById(id, (err: any, user: any) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            res.json(user)
        })
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        }
        res.send()
        const user = new UserModel(postData);
        user.save().then((obj: any) => res.json(obj)).catch((reason: any) => {
            res.json(reason)
        })
    }

    delete(req: express.Request, res: express.Response) {
        const id: string = req.params.id
        UserModel.findOneAndDelete({_id: id}).then((user: any) => {
            if (user) {
                res.json({
                    message: `User ${user.fullname} deleted`
                })
            }
        })
            .catch((err: any) => {
                res.json(404).json({
                    message: "User not found"
                })
            })
    }

    login(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        UserModel.findOne({email:postData.email}, (err: any, user: IUser) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            if (user.password === postData.password) {
                const token = createJWToken(user)
                res.json({
                    status: "success",
                    token
                })
            } else {
                res.json({
                    status: "error",
                    message: "Incorrect password or email"
                })
            }
        })
    }
}

export default UserController