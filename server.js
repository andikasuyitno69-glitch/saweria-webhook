const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// Queue untuk pending donations (bukan list total)
let donations = [];

// Roblox fetch - kirim & hapus queue (tidak kirim ulang)
app.get("/api/donations", (req, res) => {
    console.log("📦 Pending terkirim:", donations.length);

    const pending = [...donations]; // copy
    donations = []; // kosongkan queue

    res.json(pending);
});

// Saweria webhook - setiap transaksi = 1 record
app.post("/DonationWebhook", (req, res) => {
    const donation = req.body;

    const amountRaw = donation.amount_raw ?? donation.etc?.amount_to_display ?? 0;
    const amount = parseInt(amountRaw) || 0;

    const entry = {
        id: uuidv4(),
        playerName: (donation.donator_name || "Unknown").trim(),
        amount: amount,
        message: (donation.message || "").trim(),
        timestamp: Date.now()
    };

    donations.push(entry);

    console.log("💰 Donasi baru masuk:", entry);

    res.json({ success: true });
});

// Root
app.get("/", (req, res) => {
    res.json({
        status: "Saweria Webhook Active",
        pending: donations.length
    });
});

app.listen(3000, () => console.log("🚀 Server ready (Queue mode)"));
