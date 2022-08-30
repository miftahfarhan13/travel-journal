export const isAuth = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "w05KkI9AWhKxzvPFtXotUva-") {
        res.status(401).json({ msg: 'Invalid API KEY' })
        return
    }

    next()
}