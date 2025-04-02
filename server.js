import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;

// API credentials
const apiKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljYzFhZTFhLWI0YjUtNGM4Mi05MTMwLTczNDI2N2MyZTcyNSIsImlhdCI6MTczNjk4Mzc1Mywic3ViIjoiZGV2ZWxvcGVyL2ZiNzFhOTRiLTExNzYtNGFjNC0zNzMzLThhMjA5NzQxNzFhMiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1Ljc5LjIxOC43OSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.dBYBcyujhNHHx4DXGH3VG0Bg3OoNdD8ZdCsmoRpBLWiIQpQ8L8dCuHac_NWlluuQLIgvwZNqbXC867yiTf8KWg`;
const clanTag = `VGR09CL8`;

// Enable CORS for all routes
app.use(cors());

// Function to fetch data from the Clash of Clans API
async function fetchData(endpoint) {
  try {
    const response = await fetch(
      `https://api.clashofclans.com/v1/${endpoint}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, ${errorText}`);
      throw new Error(`Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}

// Route to fetch clan-related data dynamically
app.get("/api/clan/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const encodedClanTag = encodeURIComponent(clanTag);

    let endpoint;
    switch (type) {
      case "currentwar":
        endpoint = `clans/%23${encodedClanTag}/currentwar`;
        break;
      case "members":
        endpoint = `clans/%23${encodedClanTag}/members`;
        break;
      case "warlog":
        endpoint = `clans/%23${encodedClanTag}/warlog`;
        break;
      case "clanwarleagues":
        endpoint = `clanwarleagues/wars/%23${encodedClanTag}`;
        break;
      case "clans":
        endpoint = `clans/%23${encodedClanTag}`;
        break;
      case "capitalraidseasons":
        endpoint = `clans/%23${encodedClanTag}/capitalraidseasons`;
        break;
      default:
        return res.status(400).json({ error: "Invalid data type requested" });
    }

    const data = await fetchData(endpoint);
    res.json(data);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Route to fetch player data
app.get("/api/player/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const encodedPlayerTag = encodeURIComponent(tag);

    const endpoint = `players/%23${encodedPlayerTag}`;
    const data = await fetchData(endpoint);
    res.json(data);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Error fetching player data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
