import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "fuel_db",
    "postgres",
    "Tharuni@09",
    {
        host: "localhost",
        dialect: "postgres"
    }
);

export default sequelize;


