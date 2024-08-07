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
            { name: "BCA", virtualAccountNumber: "1234-5678-0001234567", virtualAccountName: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bca-logo.svg" },
            { name: "Bank BRI", virtualAccountNumber: "9101-1121-0023456789", virtualAccountName: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bri-logo.svg" },
            { name: "Bank Mandiri", virtualAccountNumber: "2718-1223-0045678901", virtualAccountName: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/mandiri-logo.svg" },
            { name: "Bank BNI", virtualAccountNumber: "5678-1234-0012345678", virtualAccountName: "dibimbing", imageUrl: "https://dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com/bni-logo.svg" },
        ]

        methods.map(async (method) => {
            const paymentMethod = await PaymentMethod.findOne({ where: { name: method.name } })

            if (!paymentMethod) {
                await PaymentMethod.create({
                    name: method.name,
                    virtualAccountNumber: method.virtualAccountNumber,
                    virtualAccountName: method.virtualAccountName,
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