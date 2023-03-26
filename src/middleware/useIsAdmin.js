import Jwt from 'jsonwebtoken'

export const isAdmin = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "24405e01-fbc1-45a5-9f5a-be13afcd757c") {
        res.status(401).json({
            code: "401",
            status: "BAD_REQUEST",
            message: 'Invalid API KEY'
        })
        return
    }

    const authorization = req.headers.authorization
    if (!authorization) {
        res.status(401).json({
            code: "401",
            status: "UNAUTHORIZED",
            message: 'Unauthorized please login first'
        });
        return
    }

    const decoded = Jwt.verify(authorization.split(' ')[1], 'secret');
    if (!decoded) {
        res.status(401).json({
            code: "401",
            status: "UNAUTHORIZED",
            message: 'Unauthorized please login first'
        });
        return
    } else {
        if (decoded.role !== 'admin') {
            res.status(401).json({
                code: "401",
                status: "BAD_REQUEST",
                message: 'User is not admin'
            });
            return
        }
    }

    next()
}