export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            const err = new Error('Image file is required')
            err.errorStatus = 422;
            throw err
        }

        const image = req.file.filename
        res.status(201).json({ msg: "Upload image success", url: `${req.protocol}://${req.get('host')}/images/${image}` })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}