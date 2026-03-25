const fs = require('fs');
const https = require('https');

try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.+)/);
  if (!match) {
    console.log("No API key found in .env.local");
    process.exit(1);
  }
  const apiKey = match[1].trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.models) {
          console.log("--- AVAILABLE GOOGLE AI MODELS ---");
          const generateModels = json.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
          generateModels.forEach(m => console.log(m.name));
        } else {
          console.log("Error response from ListModels:", data);
        }
      } catch(e) {
        console.log("Failed to parse:", data);
      }
    });
  }).on('error', (err) => {
    console.log("Request error:", err.message);
  });
} catch (e) {
  console.error("Script error:", e.message);
}
