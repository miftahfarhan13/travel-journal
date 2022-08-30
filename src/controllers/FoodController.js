import sequelize from "sequelize";
import Food from "../models/FoodModel.js";
import Like from "../models/LikeModel.js";
import Jwt from 'jsonwebtoken'
import Validator from 'fastest-validator'

const v = new Validator()

export const getFoods = async (req, res) => {
    try {
        let foodArray = []

        const foods = await Food.findAll({
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
                    include: [{ model: Like, attributes: [], }],
                    group: 'foods.id',
                    raw: true
                }).then(async (res) => {
                    for await (const food of res) {
                        const isLikes = await Like.findOne({ where: { foodId: food.id, userId: decoded.userId }, raw: true })
                        foodArray.push({
                            id: food.id,
                            name: food.name,
                            description: food.description,
                            imageUrl: food.imageUrl,
                            ingredients: food.ingredients.split(','),
                            totalLikes: food.totalLikes,
                            isLike: isLikes ? true : false,
                            createdAt: food.createdAt,
                            updatedAt: food.updatedAt
                        })
                    }
                })
            } else {
                foods.map((food) => {
                    foodArray.push({
                        id: food.id,
                        name: food.name,
                        description: food.description,
                        imageUrl: food.imageUrl,
                        ingredients: food.ingredients.split(','),
                        totalLikes: food.totalLikes,
                        createdAt: food.createdAt,
                        updatedAt: food.updatedAt
                    })
                })
            }
        } else {
            foods.map((food) => {
                foodArray.push({
                    id: food.id,
                    name: food.name,
                    description: food.description,
                    imageUrl: food.imageUrl,
                    ingredients: JSON.parse(food.ingredients),
                    totalLikes: food.totalLikes,
                    createdAt: food.createdAt,
                    updatedAt: food.updatedAt
                })
            })
        }

        res.status(200).json({
            msg: 'success',
            data: foodArray
        })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
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
                        if (isLikes) {
                            foodArray.push({
                                id: food.id,
                                name: food.name,
                                description: food.description,
                                imageUrl: food.imageUrl,
                                ingredients: food.ingredients.split(','),
                                totalLikes: food.totalLikes,
                                isLike: isLikes ? true : false,
                                createdAt: food.createdAt,
                                updatedAt: food.updatedAt
                            })
                        }
                    }
                })
            } else {
                res.status(401).json({ msg: 'Unauthorized' });
            }
        } else {
            res.status(401).json({ msg: 'Unauthorized' });
        }

        res.status(200).json({
            msg: 'success',
            data: foodArray
        })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
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
            return res.status(401).json({ msg: 'Food not found' });
        }

        const responseLike = await Like.findAll({
            where: {
                foodId: req.params.id
            },
            raw: true
        })

        let data = {
            id: response.id,
            name: response.name,
            description: response.description,
            imageUrl: response.imageUrl,
            ingredients: response.ingredients.split(','),
            totalLikes: responseLike.length,
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
                    totalLikes: responseLike.length,
                    isLike: isLikes ? true : false,
                    createdAt: response.createdAt,
                    updatedAt: response.updatedAt,
                }
            }
        }

        res.status(200).json({
            msg: 'success',
            data: data
        })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })

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
            return res.status(400).json(validate)
        }

        await Food.create({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            ingredients: req.body.ingredients.toString()
        })
        res.status(201).json({ msg: "Food Created" })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })

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
            return res.status(400).json(validate)
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
        res.status(200).json({ msg: "Food Updated" })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })

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
            return res.status(500).json({ msg: "Food not found" })
        }

        await Food.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Food Deleted" })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })

    }
}