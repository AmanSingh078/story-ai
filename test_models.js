const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24');

// List of models to test
const modelsToTest = [
  "gemini-pro",           // Text-only model
  "gemini-pro-vision",    // Vision model (older)
  "gemini-1.0-pro-vision-001", // Specific vision model
  "gemini-1.5-pro",       // Latest text model
  "gemini-1.5-pro-exp-0827", // Experimental model
  "gemini-1.5-flash",     // Fast model
  "gemini-1.5-flash-8b-exp-0827"  // Experimental flash model
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Test with a simple text prompt first
    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    
    console.log(`✅ Model ${modelName} - SUCCESS`);
    console.log(`Response: ${response.text().substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.log(`❌ Model ${modelName} - FAILED: ${error.message}`);
    return false;
  }
}

async function testVisionModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // For vision models, we need to test with text only first
    // since we don't have image data in this test
    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    
    console.log(`✅ Vision Model ${modelName} - SUCCESS`);
    console.log(`Response: ${response.text().substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.log(`❌ Vision Model ${modelName} - FAILED: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("Testing available Gemini models...\n");
  
  const textModels = ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-pro-exp-0827", "gemini-1.5-flash", "gemini-1.5-flash-8b-exp-0827"];
  const visionModels = ["gemini-pro-vision", "gemini-1.0-pro-vision-001"];
  
  console.log("--- Testing Text Models ---");
  for (const model of textModels) {
    await testModel(model);
    console.log(); // Empty line for readability
  }
  
  console.log("--- Testing Vision Models ---");
  for (const model of visionModels) {
    await testVisionModel(model);
    console.log(); // Empty line for readability
  }
  
  console.log("Model testing completed!");
}

// Run the tests
runTests().catch(console.error);