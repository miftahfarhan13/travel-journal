import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize

const TransactionItem = db.define('transaction_items', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'transactions', // <----- name of the table
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
        get() {
            const rawValue = this.getDataValue('imageUrls');
            return rawValue ? rawValue.split(',') : [];
        },
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true
})


export default TransactionItem;