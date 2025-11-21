const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// -------------------------------
//  Memory storage untuk donasi
// -------------------------------
let donations = [];

// -------------------------------
//  Endpoint untuk Roblox polling
// -------------------------------
app.get("/api/donations", (req, res) => {
    console.log("📦 Mengirim donasi ke Roblox:", donations.length);
    res.json(donations);
});

// -------------------------------
//  Endpoint Webhook dari Saweria
// -------------------------------
app.post("/DonationWebhook", (req, res) => {
    const donation = req.body;

    // Buat format donasi baru (1 per transaksi)
    const entry = {
        id: uuidv4(), // ID unik WAJIB untuk anti-duplikat Roblox
        playerName: donation.donator_name?.trim() || "Unknown",
        amount: parseInt(donation.amount_raw || donation.etc?.amount_to_display || 0),
        message: donation.message?.trim() || "",
        timestamp: Date.now()
    };

    console.log("💰 Donasi diterima:", entry);

    // Simpan sebagai entri baru (tidak di-merge)
    donations.push(entry);

    // Log total list
    console.log("➕ Total donasi tersimpan:", donations.length);

    res.json({ success: true });
});

// -------------------------------
//  Root endpoint
// -------------------------------
app.get("/", (req, res) => {
    res.json({
        status: "Saweria Webhook Active",
        mode: "HTTP Polling",
        totalTransactions: donations.length
    });
});

// -------------------------------
//  Start server
// -------------------------------
app.listen(3000, () => {
    console.log("🚀 Server berjalan di port 3000");
});
