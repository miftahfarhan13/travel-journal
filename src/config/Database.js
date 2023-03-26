import { Sequelize } from "sequelize";
import 'dotenv/config'

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOSTNAME,
    DB_NAME,
    DB_DIALECT,
    DB_PORT,
    DATABASE_URL,
    ENVIRONMENT,
    CA_CERT
} = process.env

const dbMySql = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOSTNAME,
    port: DB_PORT,
    dialect: DB_DIALECT
})

const db = new Sequelize(DATABASE_URL, { dialectOptions: { ssl: ENVIRONMENT === 'production' ? { ca: CA_CERT } : undefined } })

export default db