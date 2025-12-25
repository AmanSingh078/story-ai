const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24');

async function listAvailableModels() {
  try {
    // Use the Google API client to list models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24`);
    const data = await response.json();
    
    console.log("Available models:");
    if (data.models) {
      data.models.forEach(model => {
        console.log(`- ${model.name} (version: ${model.version})`);
        console.log(`  Supported operations: ${model.supportedGenerationMethods ? model.supportedGenerationMethods.join(', ') : 'N/A'}`);
        console.log(`  Input multimodal: ${model.inputMultimodal}`);
        console.log(`  Output multimodal: ${model.outputMultimodal}`);
        console.log('');
      });
    } else {
      console.log("No models found or error occurred:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
  }
}

// Run the model listing
listAvailableModels().catch(console.error);