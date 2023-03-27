import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Activity from "./ActivityModel.js";

const { DataTypes } = Sequelize

const Category = db.define('categories', {
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
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
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

Category.hasMany(Activity, { foreignKey: "categoryId" });
Activity.belongsTo(Category, { foreignKey: "categoryId" });

export default Category;