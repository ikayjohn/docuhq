import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

function InkStampPage() {
  const canvasRef = useRef(null);
  const [text, setText] = useState("APPROVED");
  const [subtext, setSubtext] = useState("DOCUHQ OFFICE");
  const [stampDate, setStampDate] = useState(new Date().toISOString().slice(0, 10));
  const [shape, setShape] = useState("round");
  const [inkColor, setInkColor] = useState("#b91c1c");
  const [rotation, setRotation] = useState(-8);
  const [intensity, setIntensity] = useState(78);
  const [roughness, setRoughness] = useState(32);
  const [seedLocked, setSeedLocked] = useState(true);
  const [seed, setSeed] = useState(72631);

  const settings = useMemo(() => ({
    text,
    subtext,
    stampDate,
    shape,
    inkColor,
    rotation: Number(rotation),
    intensity: Number(intensity),
    roughness: Number(roughness),
    seedLocked,
    seed: Number(seed)
  }), [text, subtext, stampDate, shape, inkColor, rotation, intensity, roughness, seedLocked, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderStamp(canvas, settings, { transparent: false });
  }, [settings]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `docuhq-stamp-${Date.now()}.png`;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    renderStamp(exportCanvas, settings, { transparent: true });
    const cropped = cropToVisiblePixels(exportCanvas, 2);
    link.href = (cropped || exportCanvas).toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">DocuHQ</a>
        <nav>
          <a href="/">Home</a>
          <a href="/itinerary/">Itinerary</a>
          <a href="/received-mail/">Received Mail</a>
          <a href="/credit-report/">Credit Reports</a>
          <a href="/crypto-wallet/">Crypto Wallet</a>
          <a href="/ink-stamp/" className="active">Ink Stamp</a>
        </nav>
      </header>
      <main className="stamp-app">
        <aside className="stamp-controls">
          <h1>Realistic Ink Stamp Generator</h1>
          <label>Primary text<input value={text} onChange={(e) => setText(e.target.value.toUpperCase())} /></label>
          <label>Secondary text<input value={subtext} onChange={(e) => setSubtext(e.target.value.toUpperCase())} /></label>
          <label>Date<input type="date" value={stampDate} onChange={(e) => setStampDate(e.target.value)} /></label>
          <label>Shape
            <select value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="round">Round</option>
              <option value="rect">Rectangular</option>
            </select>
          </label>
          <label>Ink color<input type="color" value={inkColor} onChange={(e) => setInkColor(e.target.value)} /></label>
          <label>Rotation ({rotation}deg)<input type="range" min="-20" max="20" value={rotation} onChange={(e) => setRotation(e.target.value)} /></label>
          <label>Ink intensity ({intensity}%)<input type="range" min="40" max="100" value={intensity} onChange={(e) => setIntensity(e.target.value)} /></label>
          <label>Roughness ({roughness}%)<input type="range" min="0" max="75" value={roughness} onChange={(e) => setRoughness(e.target.value)} /></label>
          <label>Random seed<input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} disabled={seedLocked} /></label>
          <label><input type="checkbox" checked={seedLocked} onChange={(e) => setSeedLocked(e.target.checked)} /> Lock seed for consistent texture</label>
          <button type="button" className="secondary" onClick={() => setSeed(Math.floor(Math.random() * 1000000))}>Generate new texture</button>
          <button type="button" onClick={downloadPng}>Download PNG</button>
        </aside>
        <section className="stamp-preview">
          <canvas ref={canvasRef} width={900} height={600} />
        </section>
      </main>
    </>
  );
}

function renderStamp(canvas, options, renderOptions = {}) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  const rng = createRng(options.seedLocked ? options.seed : Date.now());

  if (!renderOptions.transparent) {
    ctx.fillStyle = "#f8f7f4";
    ctx.fillRect(0, 0, width, height);
    drawPaperTexture(ctx, width, height, rng);
  }

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((options.rotation * Math.PI) / 180);

  const alpha = options.intensity / 100;
  const bleed = Math.max(0, Math.min(1, options.roughness / 100));

  // Soft underprint to mimic slight ink bleed into paper fibers.
  ctx.shadowColor = hexToRgba(options.inkColor, 0.28 * alpha);
  ctx.shadowBlur = 1.8 + bleed * 2.6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = hexToRgba(options.inkColor, alpha);
  ctx.fillStyle = hexToRgba(options.inkColor, alpha * 0.95);
  ctx.lineWidth = 7;

  if (options.shape === "round") drawRoundStamp(ctx, options);
  else drawRectStamp(ctx, options);

  applyInkDistress(ctx, options, rng);
  applyInkBlotches(ctx, options, rng);
  ctx.restore();
}

function drawRoundStamp(ctx, options) {
  const rOuter = 188;
  const rInner = 136;
  const ringTextRadius = (rOuter + rInner) / 2;
  ctx.beginPath();
  ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, rInner, 0, Math.PI * 2);
  ctx.stroke();

  drawArcText(ctx, options.text, 0, 0, ringTextRadius, true);
  drawArcText(ctx, options.subtext, 0, 0, ringTextRadius, false);

  ctx.font = "700 28px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(formatDate(options.stampDate), 0, 56);
}

function drawRectStamp(ctx, options) {
  const w = 420;
  const h = 250;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.strokeRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 62px Georgia, serif";
  ctx.fillText(options.text || "APPROVED", 0, -26);
  ctx.font = "700 28px Georgia, serif";
  ctx.fillText(options.subtext || "DOCUHQ OFFICE", 0, 28);
  ctx.font = "700 24px Georgia, serif";
  ctx.fillText(formatDate(options.stampDate), 0, 76);
}

function drawArcText(ctx, value, centerX, centerY, radius, top) {
  const text = String(value || "").trim();
  if (!text) return;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.font = "700 24px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = text.split("");
  const widths = chars.map((char) => ctx.measureText(char).width);
  const spacing = 1.2;
  const arcLength = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1) * spacing;
  const arcAngle = Math.min(Math.PI * 1.38, arcLength / radius);
  const direction = top ? 1 : -1;
  const startAngle = (top ? -Math.PI / 2 : Math.PI / 2) - direction * arcAngle / 2;

  let traversed = 0;
  chars.forEach((char, index) => {
    const half = widths[index] / 2;
    const offset = traversed + half + index * spacing;
    const t = arcLength > 0 ? offset / arcLength : 0.5;
    const a = startAngle + direction * t * arcAngle;
    ctx.save();
    ctx.rotate(a + (top ? Math.PI / 2 : -Math.PI / 2));
    ctx.translate(0, top ? -radius : radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    traversed += widths[index];
  });
  ctx.restore();
}

function applyInkDistress(ctx, options, rng) {
  const roughness = Number(options.roughness || 0);
  const color = options.inkColor || "#b91c1c";
  const width = options.shape === "round" ? 420 : 460;
  const height = options.shape === "round" ? 420 : 300;
  const minX = -width / 2;
  const minY = -height / 2;
  const count = Math.floor((roughness / 100) * 2400);
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < count; i += 1) {
    const x = minX + rng() * width;
    const y = minY + rng() * height;
    const r = rng() * 1.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.008 + roughness / 3200;
  ctx.strokeStyle = color;
  for (let i = 0; i < 25; i += 1) {
    const y = minY + rng() * height;
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.bezierCurveTo(minX + width * 0.35, y + rng() * 10, minX + width * 0.75, y + rng() * 10, minX + width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPaperTexture(ctx, width, height, rng) {
  // Micro grain
  for (let i = 0; i < 5200; i += 1) {
    const gray = 236 + Math.floor(rng() * 18);
    ctx.fillStyle = `rgb(${gray},${gray},${gray - 2})`;
    ctx.fillRect(rng() * width, rng() * height, 1, 1);
  }
  // Soft paper fiber clouds
  for (let i = 0; i < 220; i += 1) {
    const x = rng() * width;
    const y = rng() * height;
    const r = 8 + rng() * 24;
    const g = 238 + Math.floor(rng() * 8);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(${g},${g},${g - 2},0.08)`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

function hexToRgba(hex, alpha) {
  const raw = String(hex || "#000000").replace("#", "");
  const normalized = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw.padEnd(6, "0");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createRng(initialSeed) {
  let state = (Number(initialSeed) || 1) >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function applyInkBlotches(ctx, options, rng) {
  const color = options.inkColor || "#b91c1c";
  const roughness = Number(options.roughness || 0);
  const intensity = Number(options.intensity || 80) / 100;
  const width = options.shape === "round" ? 420 : 460;
  const height = options.shape === "round" ? 420 : 300;
  const minX = -width / 2;
  const minY = -height / 2;

  // Uneven pressure islands
  const blotches = 35 + Math.floor(roughness * 0.6);
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  for (let i = 0; i < blotches; i += 1) {
    const x = minX + rng() * width;
    const y = minY + rng() * height;
    const r = 5 + rng() * (8 + roughness * 0.2);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, hexToRgba(color, 0.05 + 0.1 * intensity));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function cropToVisiblePixels(canvas, padding = 0) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return null;

  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const outWidth = maxX - minX + 1;
  const outHeight = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = outWidth;
  out.height = outHeight;
  const outCtx = out.getContext("2d");
  if (!outCtx) return null;
  outCtx.drawImage(canvas, minX, minY, outWidth, outHeight, 0, 0, outWidth, outHeight);
  return out;
}

ReactDOM.createRoot(document.getElementById("root")).render(<InkStampPage />);
