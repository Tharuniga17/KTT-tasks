import express from "express";
import FuelEntry from "../models/FuelEntry.js";
import moment from "moment";
const router = express.Router();



router.get("/", async (req, res) => {
    try {
        const fuelEntries = await FuelEntry.findAll({
            order: [["id", "ASC"]]
        });

        const total_liters = fuelEntries.reduce(
            (sum, e) => sum + Number(e.liters || 0),
            0
        );

        const total_amount = fuelEntries.reduce(
            (sum, e) => sum + Number(e.amount || 0),
            0
        );

        const avg_price =
            total_liters > 0 ? total_amount / total_liters : 0;

        res.render("fuel", {
            fuelEntries,
            summary: { total_liters, total_amount, avg_price }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});



router.post("/", async (req, res) => {
    try {
        await FuelEntry.create({
            date: req.body.date,

            odometer: req.body.odometer === "" ? 0 : Number(req.body.odometer),
            liters: req.body.liters === "" ? 0 : Number(req.body.liters),
            amount: req.body.amount === "" ? 0 : Number(req.body.amount),
            pricePerLiter: req.body.pricePerLiter === "" ? 0 : Number(req.body.pricePerLiter),

            mileage: req.body.mileage === "" ? null : Number(req.body.mileage),

            note: req.body.note || ""
        });

        res.json({ success: true, message: "Inserted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Insert failed" });
    }
});

router.post("/update/:id", async (req, res) => {
    try {
        await FuelEntry.update(
            {
                date: req.body.date,

                odometer: req.body.odometer === "" ? 0 : Number(req.body.odometer),
                liters: req.body.liters === "" ? 0 : Number(req.body.liters),
                amount: req.body.amount === "" ? 0 : Number(req.body.amount),
                pricePerLiter: req.body.pricePerLiter === "" ? 0 : Number(req.body.pricePerLiter),

                mileage: req.body.mileage === "" ? null : Number(req.body.mileage),

                note: req.body.note || ""
            },
            {
                where: { id: req.params.id }
            }
        );

        res.json({ success: true, message: "Updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});


router.post("/delete/:id", async (req, res) => {
    try {
        await FuelEntry.destroy({
            where: { id: req.params.id }
        });

        res.json({ success: true, message: "Deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});
console.log(typeof moment);
export default router;