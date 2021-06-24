import express from "express";

import cloudinary from "../core/cloudinary";
import { UploadFileModel } from "../models";
import { IUploadFile, IUploadFileDocument } from "../models/UploadFile";

class UserController {
    create = (req: express.Request, res: express.Response): void => {
        // @ts-ignore
        const userId: string = req.user._id;
        // @ts-ignore
        const file: any = req.file;
        // @ts-ignore
        cloudinary.uploader
            .upload_stream(
                { resource_type: "auto" },
                (
                    // @ts-ignore
                    error: cloudinary.UploadApiErrorResponse | undefined,
                    // @ts-ignore
                    result: cloudinary.UploadApiResponse | undefined
                ) => {
                    if (error || !result) {
                        return res.status(500).json({
                            status: "error",
                            message: error || "upload error",
                        });
                    }

                    const fileData: Pick<
                        // @ts-ignore
                        cloudinary.UploadApiResponse,
                        "filename" | "size" | "ext" | "url" | "user"
                        > = {
                        filename: result.original_filename,
                        size: result.bytes,
                        ext: result.format,
                        url: result.url,
                        user: userId,
                    };

                    const uploadFile: IUploadFileDocument = new UploadFileModel(fileData);

                    uploadFile
                        .save()
                        .then((fileObj: IUploadFile) => {
                            res.json({
                                status: "success",
                                file: fileObj,
                            });
                        })
                        .catch((err: any) => {
                            res.json({
                                status: "error",
                                message: err,
                            });
                        });
                }
            )
            .end(file.buffer);
    };

    delete = (req: express.Request, res: express.Response): void => {
        // @ts-ignore
        const fileId: string = req.user._id;
        UploadFileModel.deleteOne({ _id: fileId }, function (err: any) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err,
                });
            }
            res.json({
                status: "success",
            });
        });
    };
}

export default UserController;