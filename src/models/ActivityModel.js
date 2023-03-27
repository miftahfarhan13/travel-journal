import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize

const Activity = db.define('activities', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories', // <----- name of the table
            key: 'id'       // <----- primary key
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrls: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_reviews: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    facilities: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location_maps: {
        type: DataTypes.TEXT,
        allowNull: true,
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

export default Activity;