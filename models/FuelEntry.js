import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FuelEntry = sequelize.define("FuelEntry", {

  date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  odometer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  liters: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  pricePerLiter: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  mileage: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },

  note: {
    type: DataTypes.STRING
  }

}, {
  tableName: "FuelEntries",  
  timestamps: false,
  freezeTableName: true 
});

export default FuelEntry;