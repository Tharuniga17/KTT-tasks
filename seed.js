import sequelize from "./config/db.js";
import FuelEntry from "./models/FuelEntry.js";

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function round(num, digits = 2) {
  return Number(Number(num).toFixed(digits));
}

const stations = [
  "Indian Oil Petrol Bunk",
  "HP Petrol Station",
  "Shell Fuel Station",
  "Bharat Petroleum",
  "Friends Service Station",
  "Highway Fuel Point",
  "City Petrol Pump",
  "Express Fuel Station",
  "Greenway Petrol Bunk",
  "National Oil Station"
];

async function seedData() {
  await sequelize.sync({ force: true });

  const data = [];

  let odometer = 1000;

  for (let i = 0; i < 50; i++) {

    const liters = round(getRandom(3, 10));
    const pricePerLiter = round(getRandom(85, 100));
    const amount = round(liters * pricePerLiter);

    odometer += Math.floor(getRandom(20, 60));

    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date,
      odometer,
      liters,
      pricePerLiter,
      amount,
      mileage: 0,
      note: stations[Math.floor(Math.random() * stations.length)]
    });
  }

  await FuelEntry.bulkCreate(data);

  console.log("inserted successfully!");
  process.exit();
}

seedData();