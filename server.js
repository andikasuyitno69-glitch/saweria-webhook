const express = require("express");
const app = express();
app.use(express.json());

// Simpan array donasi
let donations = [];

// Endpoint untuk Roblox
app.get("/api/donations", (req, res) => {
    if (!Array.isArray(donations)) donations = [];
    console.log("📦 Mengirim data ke Roblox:", donations.length, "donasi");
    res.json(donations);
});

// Webhook Saweria
app.post("/DonationWebhook", (req, res) => {
    const donation = req.body;
    
    const data = {
        playerName: donation.donator_name?.trim() || "Unknown",
        amount: parseInt(donation.amount_raw || donation.etc?.amount_to_display || 0),
        message: donation.message?.trim() || "",
        timestamp: new Date().toISOString()
    };

    console.log("💰 Donasi diterima:", data);

    const idx = donations.findIndex(d => d.playerName === data.playerName);

    if (idx !== -1) {
        donations[idx].amount += data.amount;
        donations[idx].timestamp = data.timestamp;
        donations[idx].message = data.message;
        console.log("🔄 Update total:", donations[idx]);
    } else {
        donations.push(data);
        console.log("➕ Donatur baru:", data);
    }

    donations.sort((a, b) => b.amount - a.amount);

    res.json({ success: true });
});

// Root
app.get("/", (req, res) => {
    res.json({
        message: "Saweria Webhook Active",
        total: donations.length
    });
});

app.listen(3000, () => console.log("🚀 Server ready - HTTP Polling Mode"));
