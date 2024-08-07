import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PaymentMethod from "./PaymentMethodModel.js";
import TransactionItem from "./TransactionItemModel.js";

const { DataTypes } = Sequelize

const Transaction = db.define('transactions', {
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
    paymentMethodId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'payment_methods', // <----- name of the table
            key: 'id'       // <----- primary key
        }
    },
    invoiceId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    proofPaymentUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    expiredDate: {
        type: DataTypes.DATE,
        allowNull: false,
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

Transaction.belongsTo(PaymentMethod, { foreignKey: "paymentMethodId" });
Transaction.hasMany(TransactionItem, { foreignKey: "transactionId" });

export default Transaction;