export const isAuth = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "24405e01-fbc1-45a5-9f5a-be13afcd757c") {
        res.status(401).json({
            code: "401",
            status: "BAD_REQUEST",
            message: 'Invalid API KEY'
        })
        return
    }

    next()
}