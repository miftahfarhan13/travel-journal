import Validator from "fastest-validator"
import Cart from "../models/CartModel.js"
import { getSession } from "../utils/session.js"
import Activity from "../models/ActivityModel.js"

const v = new Validator()

export const getCarts = async (req, res) => {
    try {
        const { status, decoded } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const cartArray = await Cart.findAll({
            where: {
                userId: decoded?.userId,
            },
            include: [{ model: Activity }],
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: cartArray,
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

export const addToCart = async (req, res) => {
    try {
        const { status, decoded } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const schema = {
            activityId: "string",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        const cart = await Cart.findOne({
            raw: true,
            where: {
                userId: decoded?.userId,
                activityId: req.body.activityId
            }
        });

        const totalCarts = cart?.quantity ? cart?.quantity + 1 : 1

        if (cart) {
            await Cart.update({
                quantity: totalCarts,
            }, {
                where: {
                    userId: decoded?.userId,
                    activityId: req.body.activityId,
                }
            })
        } else {
            await Cart.create({
                userId: decoded?.userId,
                activityId: req.body.activityId,
                quantity: totalCarts
            })
        }

        return res.status(200).json({ code: "200", status: "OK", message: "Added to Cart" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateTotalCartItem = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Cart not found" })
        }

        const { status } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const schema = {
            quantity: "number"
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        const findCart = await Cart.findOne({ where: { id } })

        if (findCart == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Cart not found" })
        }

        await Cart.update({ quantity: req.body.quantity, }, { where: { id } })

        return res.status(200).json({ code: "200", status: "OK", message: "Cart Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const deleteCart = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Cart not found" })
        }

        const findCart = await Cart.findOne({ where: { id } })

        if (findCart == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "Cart not found" })
        }

        await Cart.destroy({ where: { id } })

        return res.status(200).json({ code: "200", status: "OK", message: "Cart Deleted" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}