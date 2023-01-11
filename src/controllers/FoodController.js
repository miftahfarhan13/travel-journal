import sequelize from "sequelize";
import Food from "../models/FoodModel.js";
import Like from "../models/LikeModel.js";
import Jwt from 'jsonwebtoken'
import Validator from 'fastest-validator'
import Rating from "../models/RatingModel.js";

const v = new Validator()

const getFoodRating = async (foodId) => {
    const responseRating = await Rating.findAll({
        where: {
            foodId: foodId
        },
        raw: true
    })

    let foodRating = 0
    for (const rate of responseRating) {
        foodRating += rate.rating
    }
    return foodRating !== 0 ? parseFloat((foodRating / responseRating.length).toFixed(1)) : 0
}

const findFood = async () => {
    return await Food.findAll({
        attributes: [
            'id',
            'name',
            'description',
            'imageUrl',
            'ingredients',
            [sequelize.fn('COUNT', sequelize.col('likes.id')), 'totalLikes'],
        ],
        include: [{ model: Like, attributes: [], }],
        group: 'foods.id',
        raw: true
    });
}

export const getFoods = async (req, res) => {
    try {
        let foodArray = []

        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            if (decoded) {
                await findFood().then(async (res) => {
                    for await (const food of res) {
                        const isLikes = await Like.findOne({ where: { foodId: food.id, userId: decoded.userId }, raw: true })
                        const rating = await getFoodRating(food.id)

                        foodArray.push({
                            id: food.id,
                            name: food.name,
                            description: food.description,
                            imageUrl: food.imageUrl,
                            ingredients: food.ingredients.split(','),
                            rating: rating,
                            totalLikes: parseInt(food.totalLikes),
                            isLike: isLikes ? true : false,
                            createdAt: food.createdAt,
                            updatedAt: food.updatedAt
                        })
                    }
                })

            } else {
                await findFood().then(async (res) => {
                    for await (const food of res) {
                        const rating = await getFoodRating(food.id)

                        foodArray.push({
                            id: food.id,
                            name: food.name,
                            description: food.description,
                            imageUrl: food.imageUrl,
                            ingredients: food.ingredients.split(','),
                            rating: rating,
                            totalLikes: parseInt(food.totalLikes),
                            createdAt: food.createdAt,
                            updatedAt: food.updatedAt
                        })
                    }
                })
            }
        } else {
            await findFood().then(async (res) => {
                for await (const food of res) {
                    const rating = await getFoodRating(food.id)

                    foodArray.push({
                        id: food.id,
                        name: food.name,
                        description: food.description,
                        imageUrl: food.imageUrl,
                        ingredients: food.ingredients.split(','),
                        rating: rating,
                        totalLikes: parseInt(food.totalLikes),
                        createdAt: food.createdAt,
                        updatedAt: food.updatedAt
                    })
                }
            })
        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: 'Success',
            data: foodArray
        })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const getUserFoods = async (req, res) => {
    try {
        let foodArray = []
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            if (decoded) {
                await Food.findAll({
                    attributes: [
                        'id',
                        'name',
                        'description',
                        'imageUrl',
                        'ingredients',
                        [sequelize.fn('COUNT', sequelize.col('likes.id')), 'totalLikes'],
                    ],
                    include: [{ model: Like, attributes: [] }],
                    group: 'foods.id',
                    raw: true
                }).then(async (res) => {
                    for await (const food of res) {
                        const isLikes = await Like.findOne({ where: { foodId: food.id, userId: decoded.userId }, raw: true })
                        const rating = await getFoodRating(food.id)

                        if (isLikes) {
                            foodArray.push({
                                id: food.id,
                                name: food.name,
                                description: food.description,
                                imageUrl: food.imageUrl,
                                ingredients: food.ingredients.split(','),
                                rating: rating,
                                totalLikes: parseInt(food.totalLikes),
                                isLike: isLikes ? true : false,
                                createdAt: food.createdAt,
                                updatedAt: food.updatedAt
                            })
                        }
                    }
                })
            } else {
                return res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });
            }
        } else {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: 'Success',
            data: foodArray
        })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const getFoodById = async (req, res) => {
    try {
        const response = await Food.findOne({
            where: {
                id: req.params.id
            }, raw: true
        })

        if (!response) {
            return res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: 'Food not found'
            });
        }

        const responseLike = await Like.findAll({
            where: {
                foodId: req.params.id
            },
            raw: true
        })

        const rating = await getFoodRating(req.params.id)

        let data = {
            id: response.id,
            name: response.name,
            description: response.description,
            imageUrl: response.imageUrl,
            ingredients: response.ingredients.split(','),
            rating: rating,
            totalLikes: parseInt(responseLike.length),
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
        }

        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            if (decoded) {
                const isLikes = await Like.findOne({
                    where: {
                        foodId: req.params.id,
                        userId: decoded.userId
                    },
                    raw: true
                })

                data = {
                    id: response.id,
                    name: response.name,
                    description: response.description,
                    imageUrl: response.imageUrl,
                    ingredients: response.ingredients.split(','),
                    rating: rating,
                    totalLikes: parseInt(responseLike.length),
                    isLike: isLikes ? true : false,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                }
            }
        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: 'success',
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const createFood = async (req, res) => {
    try {
        const schema = {
            name: "string",
            description: "string",
            imageUrl: "string",
            ingredients: { type: "array", items: "string" },
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Food.create({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients.toString()
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Food Created" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateFood = async (req, res) => {
    try {
        const schema = {
            name: "string|optional|min:1",
            description: "string|optional|min:1",
            imageUrl: "string|optional|min:1",
            ingredients: "string[]",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Food.update({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients.toString()
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Food Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deleteFood = async (req, res) => {
    try {
        const findFood = await Food.findOne({
            where: {
                id: req.params.id
            }
        })

        if (findFood == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Food not found" })
        }

        await Food.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Food Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}