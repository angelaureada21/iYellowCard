const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); // Allow CORS
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBB5kDqjDgbUJIvp2hRmYTAsiYOCWHzQ4A"); // Replace with your Gemini API key

exports.chatWithGemini = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const prompt = req.body.prompt;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const geminiResponse = result.response;
      const text = geminiResponse.text(); // ✅ Extract clean reply

      res.status(200).json({ text });
    } catch (error) {
      console.error("Gemini error:", error.message);
      res.status(500).json({ error: "Something went wrong with Gemini." });
    }
  });
});
