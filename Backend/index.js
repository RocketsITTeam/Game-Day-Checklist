const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const checklistsPath = path.join(__dirname, "data", "checklists.json");
require("dotenv").config();

const app = express();
app.use(express.json());


const allowedOrigins = [
  "http://localhost:3000",
  "https://rockets-game-day-checklist-frontend.onrender.com", // your Render frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow no-origin (like curl / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.post("/auth/login", (req, res) => {
  const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const TECH_PASSWORD = process.env.TECH_PASSWORD;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (password === TECH_PASSWORD) {
      return res.json({ authRole: "TECH" });
    }

    if (password === ADMIN_PASSWORD) {
      return res.json({ authRole: "ADMIN" });
    }

  return res.status(401).json({ error: "Invalid password" });
});

// Get checklist definitions (private instructions)
app.get("/checklists", (req, res) => {
  try {
    const json = fs.readFileSync(checklistsPath, "utf-8");
    const data = JSON.parse(json);
    res.json(data);
  } catch (err) {
    console.error("Error reading checklists.json:", err);
    res.status(500).json({ error: "Failed to load checklists" });
  }
});
app.put("/checklists", (req, res) => {
  const adminKey = req.headers["x-admin-password"];
    if (adminKey !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const newData = req.body;
      if (!newData) return res.status(400).json({ error: "Missing body" });

      fs.writeFileSync(checklistsPath, JSON.stringify(newData, null, 2));
      res.json({ ok: true });
    } catch (err) {
      console.error("Error writing checklists.json:", err);
      res.status(500).json({ error: "Failed to save checklists" });
    }
});


// Load games from CSV
function loadGamesFromCsv() {
  const filePath = path.join(__dirname, "Games.csv");
  const csvContent = fs.readFileSync(filePath, "utf-8");

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (!records || records.length === 0) {
    return [];
  }

  // Look at the actual header names in the file
  const headerKeys = Object.keys(records[0]);
  console.log("DEBUG CSV HEADERS:", headerKeys);

  // Find the key that *acts* like "date" (ignores extra spaces/BOM/etc.)
  const dateKey =
    headerKeys.find(
      (k) => k && k.trim().toLowerCase() === "date"
    ) || headerKeys[0]; // fallback just in case

  console.log("USING dateKey:", dateKey);

  return records.map((row) => ({
    // Use whatever the real key is for the date
    date: row[dateKey],
    time: row.time,
    opponent: row.opponent,
    managerName: row.managerName,
  }));
}

//return the first game in the csv file 

function pickCurrentGame(games) {
  if (!games || games.length === 0) return null;

  // today as 'YYYY-MM-DD'
  const todayStr = new Date().toISOString().slice(0, 10);

  // games is an array of { date: 'YYYY-MM-DD', time, opponent, managerName }
  const upcoming = games
    .filter((g) => g.date && g.date >= todayStr) // string compare works on YYYY-MM-DD
    .sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });

  let g;
  if (upcoming.length > 0) {
    g = upcoming[0]; // nearest upcoming game
  } else {
    g = games[games.length - 1]; // all are in the past -> show last one
  }

  return {
    opponent: g.opponent,
    date: g.date,
    time: g.time,
    managerName: g.managerName,
  };
}

//create an endpoint in order to read tech names from json file
const techsPath = path.join(__dirname, "data", "techs.json");

app.get("/techs", (req, res) => {
  try {
    const json = fs.readFileSync(techsPath, "utf-8");
    res.json(JSON.parse(json));
  } catch (err) {
    console.error("Error reading techs.json:", err);
    res.status(500).json({ error: "Failed to load techs" });
  }
});

//allow admin to edit tech name file
app.put("/techs", (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const newData = req.body;
    if (!newData?.techOptions || !Array.isArray(newData.techOptions)) {
      return res.status(400).json({ error: "Body must include techOptions: []" });
    }
    fs.writeFileSync(techsPath, JSON.stringify(newData, null, 2), "utf-8");
    res.json({ ok: true });
  } catch (err) {
    console.error("Error writing techs.json:", err);
    res.status(500).json({ error: "Failed to save techs" });
  }
});


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Current game route
app.get("/current-game", (req, res) => {
  try {
    const games = loadGamesFromCsv();
    const currentGame = pickCurrentGame(games);

    if (!currentGame) {
      return res.status(404).json({ error: "No games found in CSV" });
    }
    console.log("SENDING CURRENT GAME:", currentGame);
    res.json(currentGame);
  } catch (err) {
    console.error("Error reading games CSV:", err);
    res.status(500).json({ error: "Failed to load game schedule" });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, "build")));

// Catch-all handler: send back React's index.html for any route not matched above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
