import jwt from "jsonwebtoken";

export const validateUser = (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        throw new Error("invalid login")
    }
    try {
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id}
        next()
    } catch (error) {
        console.log('error->', error);
        throw new Error("invalid login in catch", error);
    }
};