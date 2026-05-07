import express from "express";
import FuelEntry from "../models/FuelEntry.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const fuelEntries = await FuelEntry.findAll({
            order: [["id", "ASC"]]
        });

        const summaryResult = await FuelEntry.sequelize.query(`
      SELECT 
        COALESCE(SUM(liters::numeric), 0) AS total_liters,
        COALESCE(SUM(amount::numeric), 0) AS total_amount,
        COALESCE(AVG("pricePerLiter"::numeric), 0) AS avg_price
      FROM "FuelEntries";
    `, {
            type: FuelEntry.sequelize.QueryTypes.SELECT
        });

        const summary = summaryResult[0];

        res.render("fuel", {
            fuelEntries,
            summary
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/", async (req, res) => {
    try {

        console.log("BODY:", req.body);

        await FuelEntry.create({
            date: req.body.STRING,

            odometer: Number(req.body.odometer),
            liters: Number(req.body.liters),
            amount: Number(req.body.amount),
            pricePerLiter: Number(req.body.pricePerLiter),

            mileage: req.body.mileage === "" ? null : Number(req.body.mileage),

            note: req.body.note || ""
        });

        console.log("INSERT SUCCESS");
        res.redirect("/");

    } catch (err) {
        console.error("INSERT ERROR:", err);
        res.status(500).send(err.message);
    }
});

// ================= UPDATE =================
router.post("/update/:id", async (req, res) => {
    try {
        await FuelEntry.update(
            {
                date: req.body.date,
                odometer: req.body.odometer,
                liters: req.body.liters,
                amount: req.body.amount,
                pricePerLiter: req.body.pricePerLiter,
                mileage: req.body.mileage,
                note: req.body.note
            },
            {
                where: { id: req.params.id }
            }
        );

        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Update failed");
    }
});

router.post("/delete/:id", async (req, res) => {
    try {
        await FuelEntry.destroy({
            where: { id: req.params.id }
        });

        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Delete failed");
    }
});

export default router;