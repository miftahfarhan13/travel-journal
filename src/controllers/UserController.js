import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import User from "../models/UserModel.js";
import Validator from 'fastest-validator'

const v = new Validator()

export const registerUser = async (req, res) => {
    try {
        const schema = {
            name: "string",
            email: "string",
            password: "string|min:6",
            passwordRepeat: "string|min:6",
            role: "string",
            profilePictureUrl: "string|optional",
            phoneNumber: "string|optional|min:0|max:13",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
            // must return
            return
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
                        res.status(200).json({
                            code: "200",
                            status: "OK",
                            message: "User Created",
                            data: {
                                name: req.body.name,
                                email: req.body.email,
                                role: req.body.role,
                                profilePictureUrl: req.body.profilePictureUrl,
                                phoneNumber: req.body.phoneNumber
                            }
                        })
                    }).catch((error) => {
                        res.status(500).json({
                            code: "500",
                            status: "SERVER_ERROR",
                            message: "Something went wrong",
                            errors: error.message
                        })
                    })
                })
            })
        } else {
            res.status(409).json({
                code: "409",
                status: "CONFLICT",
                message: "Email already taken"
            })
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        if (req.headers && req.headers.authorization) {
            const authorization = req.headers.authorization.split(' ')[1]
            const decoded = Jwt.verify(authorization, 'secret');
            if (decoded) {
                res.clearCookie("jwt")
                res.status(200).json({
                    code: "200",
                    status: "OK",
                    message: "Logout successful",
                })
            } else {
                res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
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
            res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                message: "User not found"
            })
        } else {
            bcrypt.compare(req.body.password, findUser.password, (err, result) => {
                if (result) {
                    Jwt.sign({
                        email: findUser.email,
                        userId: findUser.id,
                        role: findUser.role,
                    }, 'secret', (err, token) => {
                        res.status(200).json({
                            code: "200",
                            status: "OK",
                            message: "Authentication successful",
                            data: {
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
                } else {
                    res.status(404).json({
                        code: "404",
                        status: "NOT_FOUND",
                        message: "Wrong Password"
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
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
                    code: "200",
                    status: "OK",
                    message: "User found",
                    data: {
                        id: findUser.id,
                        name: findUser.name,
                        email: findUser.email,
                        role: findUser.role,
                        profilePictureUrl: findUser.profilePictureUrl,
                        phoneNumber: findUser.phoneNumber
                    },
                });
            } else {
                res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
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
            code: "200",
            status: "OK",
            message: "Success",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
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
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
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
                return res.status(404).json({
                    code: "404",
                    status: "NOT_FOUND",
                    message: "User not found"
                })
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
                res.status(200).json({
                    code: "200",
                    status: "OK",
                    message: "User Updated"
                })
            } else {
                res.status(401).json({
                    code: "401",
                    status: "UNAUTHORIZED",
                    message: 'Unauthorized'
                });

            }
        } else {
            res.status(401).json({
                code: "401",
                status: "UNAUTHORIZED",
                message: 'Unauthorized'
            });
        }
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}

export const updateProfileUserRole = async (req, res) => {
    try {
        const schema = {
            role: "string|min:1",
        }

        const validate = v.validate(req.body, schema)

        if (validate.length) {
            return res.status(400).json({ code: "400", status: "BAD_REQUEST", errors: validate })
        }

        const findUser = await User.findOne({
            where: {
                id: req.params.userId
            }
        })

        if (findUser == null) {
            return res.status(404).json({ code: "404", status: "NOT_FOUND", message: "User not found" })
        }

        await User.update({
            role: req.body.role,
        }, {
            where: {
                id: req.params.userId
            }
        })
        res.status(200).json({
            code: "200",
            status: "OK",
            message: "User Role Updated"
        })
    } catch (error) {
        res.status(500).json({
            code: "500",
            status: "SERVER_ERROR",
            message: "Something went wrong",
            errors: error.message
        })
    }
}