import PaymentMethod from "../models/PaymentMethodModel.js";

export const getPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.findAll({
            attributes: [
                'id',
                'name',
                'imageUrl',
            ],
            raw: true
        });

        return res.status(200).json({
            code: "200",
            status: "OK",
            message: "Success",
            data: methods,
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

export const generatePaymentMethods = async (req, res) => {
    try {
        const methods = [
            { name: "BCA", virtual_account_number: "1234-5678-0001234567", virtual_account_name: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bca-logo.svg" },
            { name: "Bank BRI", virtual_account_number: "9101-1121-0023456789", virtual_account_name: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bri-logo.svg" },
            { name: "Bank Mandiri", virtual_account_number: "2718-1223-0045678901", virtual_account_name: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/mandiri-logo.svg" },
            { name: "Bank BNI", virtual_account_number: "5678-1234-0012345678", virtual_account_name: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bni-logo.svg" },
        ]

        methods.map(async (method) => {
            const paymentMethod = await PaymentMethod.findOne({ where: { name: method.name } })

            if (!paymentMethod) {
                await PaymentMethod.create({
                    name: method.name,
                    virtual_account_number: method.virtual_account_number,
                    virtual_account_name: method.virtual_account_name,
                    imageUrl: method.imageUrl
                })
            }
        })

        return res.status(200).json({ code: "200", status: "OK", message: "Generate Successful" })
    } catch (error) {
        return res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })

    }
}