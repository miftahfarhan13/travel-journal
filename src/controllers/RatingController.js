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
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const authorization = req.headers.authorization.split(' ')[1]
        const decoded = Jwt.verify(authorization, 'secret');
        if (decoded) {
            if (validate.length) {
                return res.status(400).json(validate)
            }
            const findFood = await Food.findOne({ where: { id: req.params.foodId } })
            if (!findFood) {
                return res.status(401).json({ msg: 'Food not found' });
            }

            const findUser = await User.findOne({
                where: {
                    id: decoded.userId
                }
            })

            if (findUser == null) {
                return res.status(500).json({ msg: "User not found" })
            }

            await Rating.create({
                rating: req.body.rating,
                review: req.body.review,
                foodId: req.params.foodId,
                userId: decoded.userId
            })
            return res.status(201).json({ msg: "Rating Created" })
        } else {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
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
            msg: 'success',
            data: findRating
        })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}