import Promo from "../models/PromoModel.js";
import Validator from 'fastest-validator'

const v = new Validator()

export const getPromos = async (req, res) => {
    try {
        const promos = await Promo.findAll({
            raw: true
        });

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: promos,
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

export const getPromoById = async (req, res) => {
    try {
        const promoId = req.params.id
        const promo = await Promo.findOne({
            where: {
                id: promoId
            },
            raw: true
        })

        if (!promo) {
            return res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: 'Promo not found'
            });
        }

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: promo,
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

export const createPromo = async (req, res) => {
    try {
        const schema = {
            title: "string",
            description: "string",
            terms_condition: "string",
            imageUrl: "string",
            promo_code: "string",
            promo_discount_price: "number",
            minimum_claim_price: "number",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Promo.create({
            title: req.body.title,
            description: req.body.description,
            terms_condition: req.body.terms_condition,
            imageUrl: req.body.imageUrl,
            promo_code: req.body.promo_code,
            promo_discount_price: req.body.promo_discount_price,
            minimum_claim_price: req.body.minimum_claim_price,
        })
        res.status(200).json({ code: "200", status: "OK", message: "Promo Created" })
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updatePromo = async (req, res) => {
    try {
        const schema = {
            title: "string|optional|min:1",
            description: "string|optional|min:1",
            terms_condition: "string|optional|min:1",
            imageUrl: "string|optional|min:1",
            promo_code: "string|optional|min:1",
            promo_discount_price: "number|optional|min:1",
            minimum_claim_price: "number|optional|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        const findPromo = await Promo.findOne({
            where: {
                id: req.params.id
            }
        })

        if (findPromo == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Promo not found" })
        }

        await Promo.update({
            title: req.body.title,
            description: req.body.description,
            terms_condition: req.body.terms_condition,
            imageUrl: req.body.imageUrl,
            promo_code: req.body.promo_code,
            promo_discount_price: req.body.promo_discount_price,
            minimum_claim_price: req.body.minimum_claim_price,
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Promo Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deletePromo = async (req, res) => {
    try {
        const promoId = req.params.id

        if (!promoId) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Promo not found" })
        }

        const findPromo = await Promo.findOne({
            where: {
                id: promoId
            }
        })

        if (findPromo == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Promo not found" })
        }

        await Promo.destroy({
            where: {
                id: promoId
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Promo Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}