import express from 'express';

import { UserModel } from '../models';


export default (req: express.Request, res: express.Response, next: express.NextFunction) => {

    UserModel.findOneAndUpdate(
        { _id: '6231c8e28a7257ae4fa00a4e' },
        { $set: { last_seen: new Date() }},
        {new: true},
        // Todo update doesn't work without callback
        () => {}
    )

    next();
}
