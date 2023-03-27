import Category from "../models/CategoryModel.js";
import Validator from 'fastest-validator'

const v = new Validator()

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            raw: true
        });

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: categories,
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

export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await Category.findOne({
            where: {
                id: categoryId
            },
            raw: true
        })

        if (!category) {
            return res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: 'Category not found'
            });

        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: category,
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

export const createCategory = async (req, res) => {
    try {
        const schema = {
            name: "string",
            imageUrl: "string",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Category.create({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
        })
        res.status(200).json({ code: "200", status: "OK", message: "Category Created" })
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateCategory = async (req, res) => {
    try {
        const schema = {
            name: "string|optional|min:1",
            imageUrl: "string|optional|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Category.update({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Category Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id

        if (!categoryId) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Category not found" })
        }

        const findCategory = await Category.findOne({
            where: {
                id: categoryId
            }
        })

        if (findCategory == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Category not found" })
        }

        await Category.destroy({
            where: {
                id: categoryId
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Category Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}