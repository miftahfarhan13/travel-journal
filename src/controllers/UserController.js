import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import User from "../models/UserModel.js";
import Validator from 'fastest-validator'

const v = new Validator()

export const registerUser = async (req, res) => {

    const schema = {
        name: "string",
        email: "string",
        password: "string|min:6",
        passwordRepeat: "string|min:6",
        role: "string",
        profilePictureUrl: "string|optional",
        phoneNumber: "string|optional|min:0|max:13",
        // description: "number|optional|integer|positive|min:0|max:99", // additional properties
        // state: ["boolean", "number|min:0|max:1"] // multiple types
    }

    const validate = v.validate(req.body, schema)

    if (validate.length) {
        return res.status(400).json(validate)
    }

    const findUser = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!findUser) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                const user = {
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    password: hash,
                    profilePictureUrl: req.body.profilePictureUrl,
                    phoneNumber: req.body.phoneNumber
                }

                User.create(user).then((result) => {
                    res.status(201).json({
                        msg: "User Created", data: {
                            name: req.body.name,
                            email: req.body.email,
                            role: req.body.role,
                            profilePictureUrl: req.body.profilePictureUrl,
                            phoneNumber: req.body.phoneNumber
                        }
                    })
                }).catch((error) => {
                    res.status(500).json({ msg: "Something went wrong" })
                })
            })
        })
    } else {
        res.status(409).json({ msg: "Email already taken" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const findUser = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (findUser === null) {
            res.status(400).json({ msg: "User not found" })
        } else {
            bcrypt.compare(req.body.password, findUser.password, (err, result) => {
                if (result) {
                    Jwt.sign({
                        email: findUser.email,
                        userId: findUser.id,
                        role: findUser.role,
                    }, 'secret', (err, token) => {
                        res.status(200).json({
                            msg: "Authentication successful",
                            user: {
                                id: findUser.id,
                                name: findUser.name,
                                email: findUser.email,
                                role: findUser.role,
                                profilePictureUrl: findUser.profilePictureUrl,
                                phoneNumber: findUser.phoneNumber
                            },
                            token: token
                        })
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}

export const getUserLogin = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            if (decoded) {
                const findUser = await User.findOne({
                    where: {
                        id: decoded.userId
                    }
                })
                res.status(200).json({
                    msg: "User found",
                    user: {
                        id: findUser.id,
                        name: findUser.name,
                        email: findUser.email,
                        role: findUser.role,
                        profilePictureUrl: findUser.profilePictureUrl,
                        phoneNumber: findUser.phoneNumber
                    },
                });
            } else {
                res.status(401).json({ msg: 'Unauthorized' });
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'id',
                'name',
                'email',
                'role',
                'profilePictureUrl',
                'phoneNumber',
            ],
            raw: true
        });

        res.status(200).json({
            msg: "success",
            data: users,
        });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}

export const updateProfileUser = async (req, res) => {
    try {
        const schema = {
            name: "string|optional|min:1",
            email: "email|optional",
            profilePictureurl: "string|optional|min:1",
            phoneNumber: "string|optional|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json(validate)
        }

        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');

            const findUser = await User.findOne({
                where: {
                    id: decoded.userId
                }
            })

            if (findUser == null) {
                return res.status(500).json({ msg: "User not found" })
            }

            if (decoded) {
                await User.update({
                    name: req.body.name,
                    email: req.body.email,
                    profilePictureUrl: req.body.profilePictureUrl,
                    phoneNumber: req.body.phoneNumber
                }, {
                    where: {
                        id: decoded.userId
                    }
                })
                res.status(200).json({ msg: "User Updated" })
            } else {
                res.status(401).json({ msg: 'Unauthorized' });

            }
        } else {
            res.status(401).json({ msg: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}

export const updateProfileUserRole = async (req, res) => {
    try {
        const schema = {
            role: "string|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json(validate)
        }

        const findUser = await User.findOne({
            where: {
                id: req.params.userId
            }
        })

        if (findUser == null) {
            return res.status(500).json({ msg: "User not found" })
        }

        await User.update({
            role: req.body.role,
        }, {
            where: {
                id: req.params.userId
            }
        })
        res.status(200).json({ msg: "User Role Updated" })
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", error: error.message })
    }
}