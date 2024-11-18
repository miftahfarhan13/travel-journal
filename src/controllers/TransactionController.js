import Validator from "fastest-validator";
import Cart from "../models/CartModel.js"
import { Op } from "sequelize"
import { getSession } from "../utils/session.js";
import Activity from "../models/ActivityModel.js";
import Transaction from "../models/TransactionModel.js";
import moment from "moment";
import sequelize from "../config/Database.js";
import TransactionItem from "../models/TransactionItemModel.js";
import PaymentMethod from "../models/PaymentMethodModel.js";

const v = new Validator()

const generateInvoiceId = () => {
    const prefix = "INV";
    const datePart = moment().format('YYYYMMDD'); // Using part of UUID to keep it short
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}/${datePart}/${randomNumber}`;
};

const urlValidationPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

export const getMyTransactions = async (req, res) => {
    try {
        const { status, decoded } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const transaction = await Transaction.findAll({
            where: {
                userId: decoded?.userId,
            },
            include: [{ model: PaymentMethod }, { model: TransactionItem }],
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: transaction,
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

export const getAllTransactions = async (req, res) => {
    try {
        const { status } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const transaction = await Transaction.findAll({
            include: [{ model: PaymentMethod }, { model: TransactionItem }],
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: transaction,
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

export const getTransactionById = async (req, res) => {
    try {
        const { status } = await getSession(req)

        if (status === 'UNAUTHORIZED') {
            return res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }

        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
            },
            include: [{ model: PaymentMethod }, { model: TransactionItem }],
        })

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: transaction,
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

export const createTransaction = async (req, res) => {
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
            cartIds: { type: "array", items: "string" },
            paymentMethodId: "string"
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        const carts = await Cart.findAll({
            where: {
                id: {
                    [Op.in]: req.body.cartIds
                },
            },
            include: [{ model: Activity }]
        });

        if (carts?.length === 0) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: "No Cart Found" })
        }

        const invoiceId = generateInvoiceId()
        const orderDate = moment().format('YYYY-MM-DD HH:mm:ss')
        const expiredDate = moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
        const totalAmount = carts?.reduce((accumulator, cart) => accumulator + cart?.activity?.price, 0)

        await Transaction.create({
            userId: decoded?.userId,
            paymentMethodId: req.body.paymentMethodId,
            invoiceId,
            status: "pending",
            totalAmount,
            orderDate,
            expiredDate
        }).then(async (res) => {
            const transactionId = res?.id;

            for await (const cart of carts) {
                await TransactionItem.create({
                    transactionId,
                    title: cart?.activity?.title,
                    description: cart?.activity?.description,
                    imageUrls: cart?.activity?.imageUrls?.toString(),
                    price: cart?.activity?.price,
                    price_discount: cart?.activity?.price_discount,
                    quantity: cart?.quantity,
                })
            }
        })

        carts?.map(async (cart) => {
            await Cart.destroy({
                where: {
                    id: cart.id
                }
            })
        })
        
        return res.status(200).json({ code: "200", status: "OK", message: "Transaction Created", })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateTransactionProofPayment = async (req, res) => {
    try {
        const schema = {
            proofPaymentUrl: { type: "string", pattern: urlValidationPattern },
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        await Transaction.update({
            proofPaymentUrl: req.body.proofPaymentUrl,
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ code: "200", status: "OK", message: "Transaction Proof Payment Updated" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}

export const updateTransactionStatus = async (req, res) => {
    try {
        const schema = {
            status: {
                type: "string",
                enum: ["success", "failed"],
            },
        };

        const validate = v.validate(req.body, schema);

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate });
        }

        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
            },
        })

        if (transaction?.status !== 'pending') {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: "Failed to update status, only 'pending' status are allowed" });
        }

        await Transaction.update({
            status: req.body.status,
        }, {
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).json({ code: "200", status: "OK", message: "Status Updated" });
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message,
        });
    }
};

export const cancelTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
            },
        })

        if (transaction?.status !== 'pending') {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: "Failed to cancel transaction, only 'pending' status are allowed" });
        }

        await Transaction.update({
            status: "cancelled",
        }, {
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).json({ code: "200", status: "OK", message: "Status Updated" });
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message,
        });
    }
};

