import sequelize from "./config/db.js";
import FuelEntry from "./models/FuelEntry.js";
import fuelData from "./data/fuelData.js";

const seedDatabase = async () => {

  try {

    await sequelize.sync();

    await sequelize.sync({ force: true }); // IMPORTANT for fresh test
    await FuelEntry.bulkCreate(fuelData, { validate: true });

    console.log("Data Inserted Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

  }

};

seedDatabase();