// Test Gemini API using direct fetch
// No external dependencies needed

const apiKey =
  process.env.GEMINI_API_KEY || "AIzaSyAM98KNJsePXR5ua9hi07wap38rHMl1YDQ";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

async function testGeminiAPI() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Hello, can you tell me if you're working properly?" },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log(
        "Gemini API Response:",
        data.candidates[0].content.parts[0].text
      );
      console.log("API is working correctly!");
    }
  } catch (error) {
    console.error("Error testing Gemini API:", error);
  }
}

// Run the test
testGeminiAPI();
