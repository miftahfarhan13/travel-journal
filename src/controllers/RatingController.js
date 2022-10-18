import Jwt from 'jsonwebtoken'
import User from "../models/UserModel.js";
import Rating from "../models/RatingModel.js";
import Validator from 'fastest-validator'
import Food from '../models/FoodModel.js';

const v = new Validator()

export const rateFood = async (req, res) => {
    try {
        const schema = {
            rating: "number|min:1|max:5",
            review: "string",
        }

        const validate = v.validate(req.body, schema)

        if (!req.headers.authorization) {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const authorization = req.headers.authorization.split(' ')[1]
        const decoded = Jwt.verify(authorization, 'secret');
        if (decoded) {
            if (validate.length) {
                return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
            }
            const findFood = await Food.findOne({ where: { id: req.params.foodId } })
            if (!findFood) {
                return res.status(401).json({
                    code: "404",
                    status: "NOT_FOUND",
                    message: 'Food not found'
                });
            }

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

            await Rating.create({
                rating: req.body.rating,
                review: req.body.review,
                foodId: req.params.foodId,
                userId: decoded.userId
            })
            return res.status(200).json({
                code: "200",
                status: "OK",
                message: "Rating Created"
            })
        } else {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
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

export const getRatingByFood = async (req, res) => {
    try {
        const findRating = await Rating.findAll({
            attributes: ['id', 'rating', 'review'],
            where: { foodId: req.params.foodId },
            include: [{ attributes: ['id', 'name', 'email', 'profilePictureUrl', 'phoneNumber'], model: User }]
        })
        res.status(200).json({
            code: "200",
            status: "OK",
            message: 'success',
            data: findRating
        })
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}