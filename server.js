const express = require("express");
const app = express();
app.use(express.json());

let latestDonation = null;

// 📤 Endpoint untuk Roblox
app.get("/api/donations", (req, res) => {
    if (!latestDonation) {
        return res.json({ status: "no-donation" });
    }

    // Kirim hanya 1 objek
    res.json({
        playerName: latestDonation.playerName,
        amount: latestDonation.amount,
        message: latestDonation.message || ""
    });

    latestDonation = null; // reset setelah dikirim
});

// 💰 Endpoint untuk Saweria Webhook
app.post("/DonationWebhook", (req, res) => {
    const donation = req.body;

    latestDonation = {
        playerName: donation.donator_name?.trim() || "Unknown",
        amount: parseInt(donation.amount_raw || 0),
        message: donation.message?.trim() || ""
    };

    console.log("💰 Donasi diterima:", latestDonation);

    return res.json({ success: true });
});

// Root
app.get("/", (req, res) => {
    res.json({
        message: "Saweria Webhook Active",
        latestDonation
    });
});

app.listen(3000, () => console.log("🚀 Server ready - Latest Donation Only Mode"));
