// functions/chatWithGemini.js
export async function chatWithGemini(userInput) {
  try {
    // Your fetch or API call to Gemini backend here
    const response = await fetch("YOUR_GEMINI_BACKEND_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: userInput })
    });
    
    const data = await response.json();
    return data.reply || "No response from Gemini";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong while talking to Gemini.";
  }
}
