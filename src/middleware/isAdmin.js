import Jwt from 'jsonwebtoken'

export const isAdmin = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "w05KkI9AWhKxzvPFtXotUva-") {
        res.status(401).json({ msg: 'Invalid API KEY' })
        return
    }

    const authorization = req.headers.authorization.split(' ')[1]
    const decoded = Jwt.verify(authorization, 'secret');
    if (!decoded) {
        res.status(401).json({ msg: 'Unauthorized' });
        return
    } else {
        if (decoded.role !== 'admin') {
            res.status(401).json({ msg: 'User is not admin' });
            return
        }
    }

    next()
}