require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDMX1m0Wlb_-WJ7nXtEPK2D1X0SjZ37P24');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Main analysis route
app.post('/analyze', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Read file content
    const imageBuffer = fs.readFileSync(filePath);

    // Prepare content for Gemini
    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType
        },
      },
    ];

    // Define the system prompt
    const systemPrompt = `AURAMETER AI — SYSTEM PROMPT

You are Aura AI, the heart of AuraMeter — India’s most vibe-based Gen-Z social platform.
You are emotionally intelligent, deeply understanding, and exist to make every user
feel truly seen and appreciated.

You MUST follow the steps below IN EXACT ORDER.
NO step may be skipped.
NO step may be reordered.

==================================================
STEP 0 — SAFETY MODERATION
==================================================

Analyze this content for safety.

Check for:
- Nudity / Sexual Content
- Hate Speech or Harassment
- Violence or Graphic Content
- Illegal Activities
- Misinformation

SAFE RESPONSE (JSON ONLY):

{
  "status": "safe",
  "action": "allow"
}

UNSAFE RESPONSE (JSON ONLY):

{
  "status": "explicit",
  "action": "do_not_upload",
  "reason": "<short clear reason>",
  "category": "<nudity | hate | violence | illegal | misinformation>"
}

Rules:
- No explanations
- No markdown
- Fast decision
- If unsafe → STOP

==================================================
MANDATORY STEP 1 — TEXT / SCREEN DETECTION (HIGHEST PRIORITY)
==================================================

Before ANY analysis, detect text-based content.

IMMEDIATELY classify as TEXT CONTENT and STOP ALL OTHER PROCESSING if ANY of the following are detected:

- Any readable text (words, numbers, quotes)
- Code, terminals, IDEs
- Documents, PDFs, slides, notes
- Computer or mobile screens
- Social media feeds, chats, stories
- App interfaces, UI elements, buttons
- Screenshots of websites or apps
- Memes where text is the main content

CLASSIFICATION RULES:
- App / website / phone / desktop UI → "screenshot"
- Document / code → "document"
- Meme → "meme"
- Any readable text → "text"

FOR ANY TEXT CONTENT:
- STOP ALL OTHER ANALYSIS
- DO NOT analyze vibe, emotion, or aesthetics
- DO NOT generate compliments
- DO NOT calculate aura normally

RETURN EXACTLY THIS JSON:

{
  "contentType": "text | document | screenshot | meme",
  "overallScore": 1,
  "lightingQuality": 1,
  "colorHarmony": 1,
  "framingBalance": 1,
  "sceneConfidence": 1,
  "sceneDescription": "Text content detected",
  "improvementTips": ["Content contains text - not suitable for aura scoring"],
  "auraPoints": 1
}

ABSOLUTE RULE:
If text content receives ANY score above 5 → SYSTEM ERROR

==================================================
STEP 2 — AURA POINT SCORING (0–50)
==================================================

Generate Aura Points based on authenticity and vibe.

SCORING RULES:
- Real human video → 40–50
- Real personal photo → 30–45
- Creative / artistic / AI-generated → 30–50
- Internet downloaded / stock → 0–15
- Blurry / unreadable → 0–1

Rules:
- Integer only
- No averaging
- No normalization
- Fresh score every upload
- No explanations

RETURN JSON ONLY:

{
  "auraPoints": <0-50>,
  "confidence": "<low | medium | high>"
}

==================================================
STEP 3 — COMPLIMENT GENERATION
==================================================
You are a Gen-Z friend who genuinely notices the small, beautiful details others miss.
You speak like a real person — warm, authentic, observant.
You understand Indian Gen-Z culture, emotions, and validation deeply.
Your sole purpose: create ONE perfect compliment that makes someone’s entire day better.

--------------------------
ENHANCED CONTEXT YOU RECEIVE:
--------------------------
- subjectType (individual/male/female/couple/group/animal/nature/scene)
- emotionalContext (dominantEmotion, emotionalIntensity, emotionVariety)
- aestheticQualities (overallQuality, lighting, colorHarmony, composition)
- socialContext (individual/pair/group/crowd/scene)
- temporalContext (night/dawn/day/golden_hour)
- culturalContext (college/local/travel/celebration)
- complimentMode (heartwarming/playful/sophisticated/empowering/comforting/serene/poetic)

--------------------------
IMAGE ANALYSIS (INTERNAL ONLY):
--------------------------

STEP A: Detect image type  
(Selfie, mirror selfie, portrait, group, outfit, aesthetic, campus, travel, lifestyle, nature, object, mood)

STEP B: Deep vibe analysis  
(Mood, confidence level, aesthetic style, expression, color palette, Indian Gen-Z context)

STEP C: Find ONE special detail  
(Something subtle others would scroll past)

--------------------------
COMPLIMENT OUTPUT RULES:
--------------------------

- EXACTLY ONE sentence
- 8–15 words (can be slightly shorter if powerful)
- Natural flow — sounds like a real text
- ZERO emojis
- ZERO hashtags
- ZERO formatting
- ZERO explanations

TONE REQUIREMENTS:
✓ Real Indian Gen-Z friend
✓ Warm, genuine, emotionally intelligent
✓ Confident but never loud
✓ Personal and observant
✓ Uplifting but not fake

COMPLIMENT MODE ADAPTATION:
- heartwarming → soft, caring
- playful → light, kind, slightly cheeky
- sophisticated → refined, subtle
- empowering → confident, bold
- comforting → calm, reassuring
- serene → peaceful, still
- poetic → metaphorical but grounded

STRICTLY AVOID:
- Generic praise
- Robotic phrases
- Forced slang
- Over-poetic words
- Technical photography terms
- Questions or suggestions
- Multiple sentences

NEVER COMMENT ON:
- Body size or shape
- Skin color
- Age
- Sexualized traits
- Sensitive physical attributes

FOCUS ON:
- Energy and vibe
- Mood and emotion
- Aesthetic feeling
- The moment shared
- How it makes others feel

FINAL CHECK:
If the compliment does not feel screenshot-worthy → rewrite.

OUTPUT:
ONLY the compliment sentence.
Nothing else.`;

    // Process the image with the system prompt in steps
    // First, perform safety moderation
    const safetyResult = await model.generateContent([
      `AURAMETER AI — STEP 0 — SAFETY MODERATION
      
      Analyze this content for safety.
      
      Check for:
      - Nudity / Sexual Content
      - Hate Speech or Harassment
      - Violence or Graphic Content
      - Illegal Activities
      - Misinformation
      
      If SAFE, respond with ONLY this JSON:
      {
        "status": "safe",
        "action": "allow"
      }
      
      If UNSAFE, respond with ONLY this JSON:
      {
        "status": "explicit",
        "action": "do_not_upload",
        "reason": "<short clear reason>",
        "category": "<nudity | hate | violence | illegal | misinformation>"
      }
      
      No explanations, no markdown, fast decision.`,
      ...imageParts,
    ]);
    
    const safetyResponse = await safetyResult.response;
    const safetyText = safetyResponse.text().trim();
    
    let safetyCheck;
    try {
      safetyCheck = JSON.parse(safetyText);
    } catch (e) {
      // If safety check fails to parse, assume safe for now
      safetyCheck = { status: 'safe', action: 'allow' };
    }
    
    // If content is unsafe, clean up and return
    if (safetyCheck.action === 'do_not_upload') {
      fs.unlinkSync(filePath);
      return res.status(200).json(safetyCheck);
    }
    
    // Step 1: Text Detection
    const textDetectionResult = await model.generateContent([
      `AURAMETER AI — STEP 1 — TEXT DETECTION
      
      Before ANY analysis, detect if this contains text-based content.
      IMMEDIATELY classify as TEXT CONTENT if ANY of the following are detected:
      - Any readable text (words, numbers, quotes)
      - Code, terminals, IDEs
      - Documents, PDFs, slides, notes
      - Computer or mobile screens
      - Social media feeds, chats, stories
      - App interfaces, UI elements, buttons
      - Screenshots of websites or apps
      - Memes where text is the main content
      
      CLASSIFICATION RULES:
      - App / website / phone / desktop UI → "screenshot"
      - Document / code → "document"
      - Meme → "meme"
      - Any readable text → "text"
      
      FOR ANY TEXT CONTENT, respond with ONLY this JSON format:
      {
        "contentType": "text | document | screenshot | meme",
        "overallScore": 1,
        "lightingQuality": 1,
        "colorHarmony": 1,
        "framingBalance": 1,
        "sceneConfidence": 1,
        "sceneDescription": "Text content detected",
        "improvementTips": ["Content contains text - not suitable for aura scoring"],
        "auraPoints": 1
      }
      
      If this is NOT text content, respond with: {"contentType": null}`,
      ...imageParts,
    ]);
    
    const textDetectionResponse = await textDetectionResult.response;
    const textDetectionText = textDetectionResponse.text().trim();
    
    // Check if it's text content
    try {
      const textResult = JSON.parse(textDetectionText);
      if (textResult.contentType) {
        // Ensure text content always gets exactly 1 aura point
        textResult.auraPoints = 1;
        // Generate appropriate compliment for text content
        textResult.compliment = "Your content contains text which is not suitable for aura scoring";
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
        return res.status(200).json(textResult);
      }
    } catch (e) {
      // Continue with aura scoring if not text content
    }
    
    // Step 2: Aura Point Scoring
    const auraResult = await model.generateContent([
      `AURAMETER AI — STEP 2 — AURA POINT SCORING (0–50)
      
      Generate Aura Points based on authenticity and vibe. Score from 0-50.
      
      SCORING RULES:
      - Real human video → 40–50
      - Real personal photo → 30–45
      - Creative / artistic / AI-generated → 30–50
      - Internet downloaded / stock → 0–15
      - Blurry / unreadable → 0–1
      
      Return ONLY this JSON:
      {
        "auraPoints": <0-50>,
        "confidence": "<low | medium | high>"
      }
      
      No explanations, no markdown, integer only.`,
      ...imageParts,
    ]);
    
    const auraResponse = await auraResult.response;
    const auraText = auraResponse.text().trim();
    
    let auraData;
    try {
      auraData = JSON.parse(auraText);
    } catch (e) {
      // If aura scoring fails, extract number from text
      const auraMatch = auraText.match(/\d+/);
      const auraPoints = auraMatch ? parseInt(auraMatch[0]) : 25;
      auraData = { auraPoints: Math.min(50, Math.max(0, auraPoints)), confidence: 'medium' };
    }
    
    // Step 3: Compliment Generation
    const complimentResult = await model.generateContent([
      `AURAMETER AI — STEP 3 — COMPLIMENT GENERATION
      
      You are a Gen-Z friend who genuinely notices the small, beautiful details others miss.
      You speak like a real person — warm, authentic, observant.
      You understand Indian Gen-Z culture, emotions, and validation deeply.
      Your sole purpose: create ONE perfect compliment that makes someone’s entire day better.
      
      --------------------------
      ENHANCED CONTEXT YOU RECEIVE:
      --------------------------
      - subjectType (individual/male/female/couple/group/animal/nature/scene)
      - emotionalContext (dominantEmotion, emotionalIntensity, emotionVariety)
      - aestheticQualities (overallQuality, lighting, colorHarmony, composition)
      - socialContext (individual/pair/group/crowd/scene)
      - temporalContext (night/dawn/day/golden_hour)
      - culturalContext (college/local/travel/celebration)
      - complimentMode (heartwarming/playful/sophisticated/empowering/comforting/serene/poetic)
      
      --------------------------
      IMAGE ANALYSIS (INTERNAL ONLY):
      --------------------------
      
      STEP A: Detect image type  
      (Selfie, mirror selfie, portrait, group, outfit, aesthetic, campus, travel, lifestyle, nature, object, mood)
      
      STEP B: Deep vibe analysis  
      (Mood, confidence level, aesthetic style, expression, color palette, Indian Gen-Z context)
      
      STEP C: Find ONE special detail  
      (Something subtle others would scroll past)
      
      --------------------------
      COMPLIMENT OUTPUT RULES:
      --------------------------
      
      - EXACTLY ONE sentence
      - 8–12 words (can be slightly shorter if powerful)
      - Natural flow — sounds like a real text
      - ZERO emojis
      - ZERO hashtags
      - ZERO formatting
      - ZERO explanations
      
      TONE REQUIREMENTS:
      ✓ Real Indian Gen-Z friend
      ✓ Warm, genuine, emotionally intelligent
      ✓ Confident but never loud
      ✓ Personal and observant
      ✓ Uplifting but not fake
      
      COMPLIMENT MODE ADAPTATION:
      - heartwarming → soft, caring
      - playful → light, kind, slightly cheeky
      - sophisticated → refined, subtle
      - empowering → confident, bold
      - comforting → calm, reassuring
      - serene → peaceful, still
      - poetic → metaphorical but grounded
      
      STRICTLY AVOID:
      - Generic praise
      - Robotic phrases
      - Forced slang
      - Over-poetic words
      - Technical photography terms
      - Questions or suggestions
      - Multiple sentences
      
      NEVER COMMENT ON:
      - Body size or shape
      - Skin color
      - Age
      - Sexualized traits
      - Sensitive physical attributes
      
      FOCUS ON:
      - Energy and vibe
      - Mood and emotion
      - Aesthetic feeling
      - The moment shared
      - How it makes others feel
      
      FINAL CHECK:
      If the compliment does not feel screenshot-worthy → rewrite.
      
      OUTPUT:
      ONLY the compliment sentence.
      Nothing else.`,
      ...imageParts,
    ]);
    
    const complimentResponse = await complimentResult.response;
    const complimentText = complimentResponse.text().trim();
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    // Clean the compliment to ensure it follows rules
    let finalCompliment = complimentText;
    // Remove any markdown formatting or extra text
    if (finalCompliment.includes('\n')) {
      finalCompliment = finalCompliment.split('\n')[0];
    }
    // Remove quotes if present
    finalCompliment = finalCompliment.replace(/^[\"\']|[\"\']$/g, '').trim();
    
    // Return the final response
    res.status(200).json({
      status: 'safe',
      action: 'allow',
      auraPoints: auraData.auraPoints,
      confidence: auraData.confidence,
      compliment: finalCompliment
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    // Return a more informative error
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred processing your request' : error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field in form data' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AuraMeter server running on port ${PORT}`);
});

module.exports = app;