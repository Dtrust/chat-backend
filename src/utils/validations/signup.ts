import { check } from "express-validator";


export default [
    check('email').isEmail(),
    check('username').isLength({min: 2}),
    check('password').isLength({min: 8})
]
