const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Ganti <db_password> dengan password MongoDB Atlas Anda
const mongoURI = "mongodb+srv://fazz:<db_password>@tokendb.bekv8.mongodb.net/saweria?retryWrites=true&w=majority";

// Koneksi ke MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Atlas Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Skema database untuk menyimpan donasi
const DonationSchema = new mongoose.Schema({
    name: String,
    message: String,
    amount: Number,
    payment_reference: String,
    timestamp: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", DonationSchema);

// Webhook Saweria
app.post("/webhook/saweria", async (req, res) => {
    const data = req.body;

    if (data && data.donation) {
        const { name, message, amount, payment_reference } = data.donation;

        // Simpan ke MongoDB Atlas
        const newDonation = new Donation({
            name,
            message,
            amount,
            payment_reference,
        });

        await newDonation.save();
        console.log("Donasi tersimpan:", newDonation);
    }

    res.status(200).send("OK");
});

// Jalankan server di port 3000
app.listen(3000, () => console.log("Server webhook berjalan di port 3000"));
