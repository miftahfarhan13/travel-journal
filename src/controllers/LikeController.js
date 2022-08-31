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
                    return res.status(500).json({ msg: "User not found" })
                }

                if (findFood !== null) {
                    return res.status(401).json({ msg: 'Food already liked' });
                } else {
                    const like = {
                        foodId: req.body.foodId,
                        userId: decoded.userId,
                    }

                    await Like.create(like).then((result) => {
                        res.status(201).json({ msg: "Food Liked" })
                    }).catch((error) => {
                        res.status(500).json({ msg: "Something went wrong", error: error.message })
                    })
                }
            } else {
                res.status(401).json({ msg: 'Unauthorized' });
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
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
                    return res.status(500).json({ msg: "User not found" })
                }

                if (findFood === null) {
                    return res.status(401).json({ msg: 'Likes not found' });
                } else {
                    await Like.destroy({
                        where: {
                            foodId: req.body.foodId,
                            userId: decoded.userId,
                        }
                    }).then((result) => {
                        res.status(201).json({ msg: "Food unliked" })
                    }).catch((error) => {
                        res.status(500).json({ msg: "Something went wrong" })
                    })
                }
            } else {
                res.status(401).json({ msg: 'Unauthorized' });
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}