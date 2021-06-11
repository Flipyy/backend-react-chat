import express from "express"
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import {UserModel} from "../models"
import {IUser} from "../models/User"
import {createJWToken} from "../utils";

class UserController {
    show = (req: express.Request, res: express.Response): void => {
        const id: string = req.params.id
        UserModel.findById(id, (err: any, user: IUser) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            res.json(user)
        })
    }

    getMe = (req: express.Request, res: express.Response): void => {
        // @ts-ignore
        const id: string = req.user._id
        UserModel.findById(id, (err: any, user: IUser) => {
            if (err) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            res.json(user)
        })
    }

    create = (req: express.Request, res: express.Response): void => {
        const postData: { email: string; fullname: string; password: string } = {
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

    delete = (req: express.Request, res: express.Response): void => {
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

    login = (req: express.Request, res: express.Response): void => {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }

        UserModel.findOne({email:postData.email}, (err: any, user: any) => {
            if (err || !user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            if (bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWToken(user);
                res.json({
                    status: "success",
                    token,
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