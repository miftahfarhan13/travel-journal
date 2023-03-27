import Activity from "../models/ActivityModel.js";
import Validator from 'fastest-validator'
import Category from "../models/CategoryModel.js";

const v = new Validator()

export const getActivities = async (req, res) => {
    try {
        let activityArray = []

        await Activity.findAll({
            raw: true,
        }).then(async (res) => {
            for await (const activity of res) {
                const category = await Category.findOne({ where: { id: activity.categoryId }, raw: true })

                activityArray.push({
                    id: activity.id,
                    categoryId: activity.categoryId,
                    category: category,
                    title: activity.title,
                    description: activity.description,
                    imageUrls: activity.imageUrls.split(','),
                    price: activity.price,
                    price_discount: activity.price_discount,
                    rating: activity.rating,
                    total_reviews: activity.total_reviews,
                    facilities: activity.facilities,
                    address: activity.address,
                    province: activity.province,
                    city: activity.city,
                    location_maps: activity.location_maps,
                    createdAt: activity.createdAt,
                    updatedAt: activity.updatedAt
                })
            }
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: activityArray,
        });
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const getActivitiesByCategoryId = async (req, res) => {
    try {
        let activityArray = []

        await Activity.findAll({
            raw: true,
            where: {
                categoryId: req.params.categoryId
            }
        }).then(async (res) => {
            for await (const activity of res) {
                const category = await Category.findOne({ where: { id: activity.categoryId }, raw: true })

                activityArray.push({
                    id: activity.id,
                    categoryId: activity.categoryId,
                    category: category,
                    title: activity.title,
                    description: activity.description,
                    imageUrls: activity.imageUrls.split(','),
                    price: activity.price,
                    price_discount: activity.price_discount,
                    rating: activity.rating,
                    total_reviews: activity.total_reviews,
                    facilities: activity.facilities,
                    address: activity.address,
                    province: activity.province,
                    city: activity.city,
                    location_maps: activity.location_maps,
                    createdAt: activity.createdAt,
                    updatedAt: activity.updatedAt
                })
            }
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: activityArray,
        });
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            where: {
                id: req.params.id
            }, raw: true
        })

        if (!activity) {
            return res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: 'Activit not found'
            });
        }

        const category = await Category.findOne({ where: { id: activity.categoryId }, raw: true })

        let data = {
            id: activity.id,
            categoryId: activity.categoryId,
            category: category,
            title: activity.title,
            description: activity.description,
            imageUrls: activity.imageUrls.split(','),
            price: activity.price,
            price_discount: activity.price_discount,
            rating: activity.rating,
            total_reviews: activity.total_reviews,
            facilities: activity.facilities,
            address: activity.address,
            province: activity.province,
            city: activity.city,
            location_maps: activity.location_maps,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt
        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: data,
        });
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const createActivity = async (req, res) => {
    try {
        const schema = {
            categoryId: "string",
            title: "string",
            description: "string",
            imageUrls: { type: "array", items: "string" },
            price: "number",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Activity.create({
            categoryId: req.body.categoryId,
            title: req.body.title,
            description: req.body.description,
            imageUrls: req.body.imageUrls.toString(),
            price: req.body.price,
            price_discount: req.body.price_discount,
            rating: req.body.rating,
            total_reviews: req.body.total_reviews,
            facilities: req.body.facilities,
            address: req.body.address,
            province: req.body.province,
            city: req.body.city,
            location_maps: req.body.location_maps,
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Activity Created" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateActivity = async (req, res) => {
    try {
        const schema = {
            categoryId: "string|optional|min:1",
            title: "string|optional|min:1",
            description: "string|optional|min:1",
            imageUrls: { type: "array", items: "string" },
            price: "number|optional|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Activity.update({
            categoryId: req.body.categoryId,
            title: req.body.title,
            description: req.body.description,
            imageUrls: req.body.imageUrls.toString(),
            price: req.body.price,
            price_discount: req.body.price_discount,
            rating: req.body.rating,
            total_reviews: req.body.total_reviews,
            facilities: req.body.facilities,
            address: req.body.address,
            province: req.body.province,
            city: req.body.city,
            location_maps: req.body.location_maps,
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Activity Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deleteActivity = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Activity not found" })
        }

        const findActivity = await Activity.findOne({
            where: {
                id: id
            }
        })

        if (findActivity == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Activity not found" })
        }

        await Activity.destroy({
            where: {
                id: id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Activity Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

