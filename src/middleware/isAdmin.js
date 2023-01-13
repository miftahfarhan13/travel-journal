import Jwt from 'jsonwebtoken'

export const isAdmin = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "w05KkI9AWhKxzvPFtXotUva-") {
        res.status(401).json({
            code: "401",
            status: "BAD_REQUEST",
            message: 'Invalid API KEY'
        })
        return
    }

    if (req.headers.authorization) {
        const authorization = req.headers.authorization.split(' ')[1]
        const decoded = Jwt.verify(authorization, 'secret');
        if (!decoded) {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized please login first'
            });
        } else {
            if (decoded.role !== 'admin') {
                return res.status(401).json({
                    code: "401",
                    status: "BAD_REQUEST",
                    message: 'User is not admin'
                });
            }
        }
    } else {
        return res.status(401).json({
            code: "401",
            status: "UNAUTHORIZED",
            message: 'Unauthorized please login first'
        });
    }


    next()
}