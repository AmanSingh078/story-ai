const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24');

async function testSpecificModels() {
  // Test the models that might support image input based on the list
  const potentialVisionModels = [
    "gemini-2.0-flash-exp-image-generation",
    "gemini-2.5-flash-image-preview", 
    "gemini-2.5-flash-image",
    "gemini-3-pro-image-preview"
  ];
  
  // Also test some standard models for text
  const textModels = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-pro-latest"
  ];
  
  console.log("Testing potential vision models...\n");
  
  for (const modelName of potentialVisionModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test with a simple text prompt first
      const result = await model.generateContent("Hello, how are you?");
      const response = await result.response;
      
      console.log(`✅ Vision Model ${modelName} - SUCCESS`);
      console.log(`Response: ${response.text().substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ Vision Model ${modelName} - FAILED: ${error.message}`);
    }
    console.log(); // Empty line
  }
  
  console.log("Testing text models...\n");
  
  for (const modelName of textModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test with a simple text prompt
      const result = await model.generateContent("Hello, how are you?");
      const response = await result.response;
      
      console.log(`✅ Text Model ${modelName} - SUCCESS`);
      console.log(`Response: ${response.text().substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ Text Model ${modelName} - FAILED: ${error.message}`);
    }
    console.log(); // Empty line
  }
}

// Run the tests
testSpecificModels().catch(console.error);