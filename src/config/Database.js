import { Sequelize } from "sequelize";
import 'dotenv/config'

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOSTNAME,
    DB_NAME,
    DB_DIALECT,
    DB_PORT
} = process.env

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOSTNAME,
    port: DB_PORT,
    dialect: DB_DIALECT
})

export default db