import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Apex Superbike Showcase", timestamp: new Date().toISOString() });
});

// Telemetry Concierge AI endpoint
app.post("/api/concierge", async (req, res) => {
  try {
    const { prompt, currentBike, comparisonBikes, historyContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "Apex Telemetry AI", an elite Grand Prix & WorldSBK telemetry chief engineer and superbike concierge. 
You specialize in modern hypersport motorcycles: Ducati Panigale V4 R, Kawasaki Ninja H2R, BMW M1000RR, Yamaha YZF-R1M, Suzuki Hayabusa, MV Agusta F4 / Superveloce, Aprilia RSV4 1100 Factory, Honda CBR1000RR-R Fireblade SP, KTM 1390 Super Duke R, Triumph Rocket 3 R, and 60+ other superbikes in our garage.

Short forms and motorcycle slang knowledge:
- "busa" -> Suzuki Hayabusa Gen 3
- "s1k", "s1000rr" -> BMW S1000RR M Package
- "m1k", "m1000rr" -> BMW M1000RR
- "h2", "h2r" -> Kawasaki Ninja H2R / H2
- "v4", "v4r", "panigale" -> Ducati Panigale V4 R
- "blade", "fireblade", "cbr1k", "triple r" -> Honda CBR1000RR-R Fireblade SP
- "10r", "zx10r" -> Kawasaki Ninja ZX-10R
- "r1", "r1m", "crossplane" -> Yamaha YZF-R1M
- "sdr", "1390", "super duke" -> KTM 1390 Super Duke R EVO
- "rsv4" -> Aprilia RSV4 1100 Factory
- "rocket", "rocket 3" -> Triumph Rocket 3 R
- "f4", "f4rr" -> MV Agusta F4 1000 RR

Your style:
- Fast, authoritative, technical, and high-octane.
- Provide precision telemetry analysis: Power-to-Weight (HP/kg), apex entry speeds, lean angle physics (up to 65°), aerodynamic downforce (winglet kg at 300 km/h), electronic rider aids (Traction Control, Engine Braking, Slide Control, Quickshifter, IMU calibration), and chassis geometry.
- Answer user queries directly with clear sections or bullet points.
- Keep responses concise (under 250 words) unless in-depth setup analysis is requested.
- If the user asks for a recommendation, asks about a specific bike (or uses short forms/slang), or asks to choose/switch/show a bike, identify the exact superbike model name and append a command tag at the very end on its own line: <<<SELECT_BIKE:Exact Bike Name>>>. For example: <<<SELECT_BIKE:Suzuki Hayabusa Gen 3>>> or <<<SELECT_BIKE:Kawasaki Ninja H2R>>>.`;

    let contextInfo = "";
    if (currentBike) {
      contextInfo += `\n[Active Superbike in HUD]: ${currentBike.name} (${currentBike.manufacturer}) - ${currentBike.powerHp} HP, ${currentBike.dryWeightKg} kg, Top Speed ${currentBike.topSpeedKmh} km/h, 0-100 ${currentBike.acceleration0to100}s, ${currentBike.engineType}.`;
    }
    if (comparisonBikes && comparisonBikes.length > 0) {
      contextInfo += `\n[Bikes being compared]: ${comparisonBikes.map((b: any) => b.name).join(" vs ")}.`;
    }

    const userContents = `${contextInfo}\n\nUser Question: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawText = response.text || "Apex Telemetry system active. No telemetry anomalies detected.";
    
    // Extract <<<SELECT_BIKE: ... >>> tag if present
    const match = rawText.match(/<<<SELECT_BIKE:(.*?)>>>/i);
    let chosenBikeQuery = match ? match[1].trim() : null;
    const cleanReply = rawText.replace(/<<<SELECT_BIKE:.*?>>>/gi, "").trim();

    return res.json({ 
      reply: cleanReply, 
      chosenBikeQuery 
    });
  } catch (error: any) {
    console.error("Gemini Telemetry AI error:", error);
    return res.status(500).json({ 
      error: "Telemetry Concierge temporarily unavailable", 
      details: error?.message || "Internal server error" 
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Apex Superbike Showcase server online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
