import Banner from "../models/BannerModel.js";
import Validator from 'fastest-validator'

const v = new Validator()

export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll({
            raw: true
        });

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: banners,
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

export const getBannerById = async (req, res) => {
    try {
        const bannerId = req.params.id
        const banner = await Banner.findOne({
            where: {
                id: bannerId
            },
            raw: true
        })

        if (!banner) {
            return res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: 'Banner not found'
            });

        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: banner,
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

export const createBanner = async (req, res) => {
    try {
        const schema = {
            name: "string",
            imageUrl: "string",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Banner.create({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
        })
        res.status(200).json({ code: "200", status: "OK", message: "Banner Created" })
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateBanner = async (req, res) => {
    try {
        const schema = {
            name: "string|optional|min:1",
            imageUrl: "string|optional|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Banner.update({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Banner Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deleteBanner = async (req, res) => {
    try {
        const bannerId = req.params.id

        if (!bannerId) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Banner not found" })
        }

        const findBanner = await Banner.findOne({
            where: {
                id: bannerId
            }
        })

        if (findBanner == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Banner not found" })
        }

        await Banner.destroy({
            where: {
                id: bannerId
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Banner Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}