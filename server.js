// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to handle email sending via EmailJS
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const payload = {
    service_id: serviceID,
    template_id: templateID,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: {
      from_name: name,
      from_email: email,
      message: message,
    },
  };

  try {
    const response = await axios.post("https://api.emailjs.com/api/v1.0/email/send", payload);
    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error("Email sending failed:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

