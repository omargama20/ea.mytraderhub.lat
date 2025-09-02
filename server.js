const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Usa variable de entorno para la API Key (más seguro)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/ea-lab", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400
      })
    });
    const data = await groqRes.json();
    res.json({
      result: data.choices?.[0]?.message?.content || "Sin respuesta del modelo."
    });
  } catch (err) {
    res.status(500).json({ error: "Error al consultar el modelo." });
  }
});

// Render usa el puerto de la variable de entorno PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("EA LAB Proxy backend corriendo en http://localhost:" + PORT));
