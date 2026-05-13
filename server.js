const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp"
};

async function getBtcUsdRate() {
  const providers = [
    async () => {
      const response = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
      if (!response.ok) throw new Error(`coinbase:${response.status}`);
      const data = await response.json();
      return { rate: Number(data?.data?.amount), source: "Coinbase" };
    },
    async () => {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      if (!response.ok) throw new Error(`coingecko:${response.status}`);
      const data = await response.json();
      return { rate: Number(data?.bitcoin?.usd), source: "CoinGecko" };
    },
    async () => {
      const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
      if (!response.ok) throw new Error(`binance:${response.status}`);
      const data = await response.json();
      return { rate: Number(data?.price), source: "Binance" };
    }
  ];

  let lastError = "all providers failed";
  for (const provider of providers) {
    try {
      const result = await provider();
      if (Number.isFinite(result.rate) && result.rate > 0) {
        return result;
      }
      lastError = "invalid rate payload";
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(lastError);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function serveStatic(req, res, pathname) {
  const rawPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (parsed.pathname === "/api/btc-usd") {
      try {
        const result = await getBtcUsdRate();
        sendJson(res, 200, {
          ok: true,
          rate: result.rate,
          source: result.source,
          at: new Date().toISOString()
        });
      } catch (error) {
        sendJson(res, 502, {
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
      return;
    }

    serveStatic(req, res, parsed.pathname);
  } catch {
    res.writeHead(500);
    res.end("Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
