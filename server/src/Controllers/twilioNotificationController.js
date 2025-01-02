const twilio = require("twilio");
const dotnet = require("dotenv").config()

// Twilio Credentials
const accountSid =  process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendMessage = async (req, res) => {
  const {to, message } = req.body; // Expecting `to` and `message` in the request body
  console.log("notification send to whatsapp before")
  try {
    const result = await client.messages.create({
      body: message, // Message content
      // from: "whatsapp:+917974850766", // Twilio Sandbox number
      from: "whatsapp:+14155238886",
      // to: `whatsapp:${to}` // Recipient's WhatsApp number
      to: `whatsapp:+919301983476` // Recipient's WhatsApp number
    });
    console.log("notification send on whatsapp after", result)
    res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendMessage };
