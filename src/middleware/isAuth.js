export const isAuth = (req, res, next) => {
    if (!req.header("apiKey") || req.header("apiKey") !== "w05KkI9AWhKxzvPFtXotUva-") {
        res.status(401).json({
            code: "401",
            status: "BAD_REQUEST", 
            message: 'Invalid API KEY'
        })
        return
    }

    next()
}