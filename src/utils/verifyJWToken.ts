import jwt, {VerifyErrors} from "jsonwebtoken"
import {IUser} from "../models/User";

export interface DecodedData {
    data: {
        _doc: IUser;
    };
}

export default (token: string) =>
    new Promise((resolve: (decodedData: DecodedData) => void,
                 reject: (err: any)=> void) => {
        jwt.verify(token, process.env.JWT_SECRET || "", (err: any, decodedData)=> {
            if (err || !decodedData) {
                return reject(err)
            }
            resolve(decodedData as DecodedData)
        })
    })