import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize

const Rating = db.define('ratings', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // <----- name of the table
            key: 'id'       // <----- primary key
        }
    },
    foodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'foods', // <----- name of the table
            key: 'id'       // <----- primary key
        }
    },
    rating: {
        type: DataTypes.INTEGER,
    },
    review: {
        type: DataTypes.TEXT,
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

export default Rating;