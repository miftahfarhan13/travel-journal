import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Activity from "./ActivityModel.js";

const { DataTypes } = Sequelize

const Cart = db.define('carts', {
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
    activityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'activities', // <----- name of the table
            key: 'id'       // <----- primary key
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
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
    freezeTableName: true,
    timestamps: true
})

// Cart.hasOne(Activity, { foreignKey: "id" });

Cart.belongsTo(Activity, { foreignKey: "activityId" });

export default Cart;