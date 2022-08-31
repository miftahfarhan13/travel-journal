import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Food from "./FoodModel.js";
import Like from "./LikeModel.js";
import Rating from "./RatingModel.js";

const { DataTypes } = Sequelize

const User = db.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "general",
    },
    profilePictureUrl: {
        type: DataTypes.TEXT,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true
})

User.hasMany(Like, { foreignKey: 'userId' })
Food.hasMany(Like, { foreignKey: 'foodId' })

User.hasMany(Rating, { foreignKey: 'userId' })
Food.hasMany(Rating, { foreignKey: 'foodId' })

Rating.belongsTo(User, { foreignKey: 'userId' })
Rating.belongsTo(Food, { foreignKey: 'foodId' })

export default User;