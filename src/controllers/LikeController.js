import Jwt from 'jsonwebtoken'
import User from "../models/UserModel.js";
import Like from "../models/LikeModel.js";

export const likeFood = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');
            if (decoded) {
                const findFood = await Like.findOne({
                    where: {
                        foodId: req.body.foodId,
                        userId: decoded.userId,
                    }
                })

                const findUser = await User.findOne({
                    where: {
                        id: decoded.userId
                    }
                })

                if (findUser == null) {
                    return res.status(404).json({
                        code: "404",
                        status: "NOT_FOUND",
                        message: "User not found"
                    })
                }

                if (findFood !== null) {
                    return res.status(401).json({
                        code: "409",
                        status: "CONFLICT",
                        message: 'Food already liked'
                    });
                } else {
                    const like = {
                        foodId: req.body.foodId,
                        userId: decoded.userId,
                    }

                    await Like.create(like).then((result) => {
                        res.status(200).json({
                            code: "200",
                            status: "OK",
                            message: "Food Liked"
                        })
                    }).catch((error) => {
                        res.status(500).json({
                            code: "500",
                            status: "SERVER_ERROR",
                            message: "Something went wrong",
                            errors: error.message
                        })
                    })
                }
            } else {
                res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const unlikeFood = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            if (decoded) {
                const findFood = await Like.findOne({
                    where: {
                        foodId: req.body.foodId,
                        userId: decoded.userId,
                    }
                })

                const findUser = await User.findOne({
                    where: {
                        id: decoded.userId
                    }
                })

                if (findUser == null) {
                    return res.status(404).json({
                        code: "404",
                        status: "NOT_FOUND",
                        message: "User not found"
                    })
                }

                if (findFood === null) {
                    return res.status(404).json({
                        code: "404",
                        status: "NOT_FOUND",
                        message: 'Food not found'
                    });
                } else {
                    await Like.destroy({
                        where: {
                            foodId: req.body.foodId,
                            userId: decoded.userId,
                        }
                    }).then((result) => {
                        res.status(200).json({
                            code: "200",
                            status: "OK",
                            message: "Food unliked"
                        })
                    }).catch((error) => {
                        res.status(500).json({
                            code: "500",
                            status: "SERVER_ERROR",
                            message: "Something went wrong",
                            errors: error.message
                        })
                    })
                }
            } else {
                res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}