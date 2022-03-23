// import express from 'express';
//
// import { verifyJWToken } from "../utils";
//
//
// export default (req: express.Request, res: express.Response, next: express.NextFunction): void => {
//
//     const token = req.headers.token;
//
//     verifyJWToken(token).then((user) => {
//         req.user = user;
//         next();
//     }).catch(() => {
//         res.status(403)
//             .json({message: 'Invalid auth token provide'})
//     })
//
// }


import express from "express";
import { verifyJWToken } from "../utils";
import { DecodedData } from "../utils/verifyJWToken";


export default (
    req: any,
    res: express.Response,
    next: express.NextFunction
): void => {
    if (
        req.path === "/user/signin" ||
        req.path === "/user/signup" ||
        req.path === "/user/verify"
    ) {
        return next();
    }

    const token: string | null =
        "token" in req.headers ? (req.headers.token as string) : null;

    if (token) {
        verifyJWToken(token)
            .then((user: DecodedData | null) => {
                if (user) {
                    req.user = user.data._doc;
                }
                next();
            })
            .catch(() => {
                res.status(403).json({ message: "Invalid auth token provided." });
            });
    }
};
