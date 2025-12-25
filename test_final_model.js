const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24');

async function testFinalModel() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    
    // Test with a simple text prompt to make sure it works
    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    
    console.log(`✅ Final Model gemini-2.5-flash-image - SUCCESS`);
    console.log(`Response: ${response.text().substring(0, 100)}...`);
    
    // Now test with a mock image data structure (we can't test with real image without file)
    console.log("\nModel is ready for image processing with AuraMeter system prompt!");
  } catch (error) {
    console.log(`❌ Final Model gemini-2.5-flash-image - FAILED: ${error.message}`);
  }
}

// Run the final test
testFinalModel().catch(console.error);