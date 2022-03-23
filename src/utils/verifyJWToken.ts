// import jwt, { VerifyErrors } from "jsonwebtoken";
//
//
// export default (token: any) => {
//     new Promise ((resolve, reject) => {
//         jwt.verify(token, process.env.JWT_KEY || '', (err: any, decodedData: any) => {
//             if (err || !decodedData) {
//                 return reject(err)
//             }
//
//             resolve(decodedData);
//         })
//     })
// }
    // new Promise(
    //     (
    //         resolve: (decodedData: DecodedData) => void,
    //         reject: (err: VerifyErrors) => void
    //     ) => {
    //         jwt.verify(
    //             token,
    //             process.env.JWT_SECRET || "",
    //             (err: VerifyErrors, decodedData) => {
    //                 if (err || !decodedData) {
    //                     return reject(err);
    //                 }
    //
    //                 resolve(decodedData as DecodedData);
    //             }
    //         );
    //     }
    // );


import jwt, { VerifyErrors } from "jsonwebtoken";
import { IUser } from "../models/User";


export interface DecodedData {
    data: {
        _doc: IUser;
    };
}


export default (token: string): Promise<DecodedData | null> =>
    new Promise(
        (
            resolve: (decodedData: DecodedData) => void,
            reject: (err: VerifyErrors) => void
        ) => {
            jwt.verify(
                token,
                process.env.JWT_SECRET || '',
                (err: any, decodedData) => {
                    if (err || !decodedData) {
                        return reject(err);
                    }

                    resolve(decodedData as DecodedData);
                }
            );
        }
    );
