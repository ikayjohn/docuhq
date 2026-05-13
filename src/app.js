const airports = {
  LOS: { city: "Lagos", name: "Murtala Muhammed International", country: "Nigeria", lat: 6.577, lon: 3.321 },
  ABV: { city: "Abuja", name: "Nnamdi Azikiwe International", country: "Nigeria", lat: 9.006, lon: 7.263 },
  PHC: { city: "Port Harcourt", name: "Port Harcourt International", country: "Nigeria", lat: 5.015, lon: 6.949 },
  BAH: { city: "Bahrain", name: "Bahrain International", country: "Bahrain", lat: 26.267, lon: 50.637 },
  AUH: { city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates", lat: 24.443, lon: 54.651 },
  ACC: { city: "Accra", name: "Kotoka International", country: "Ghana", lat: 5.605, lon: -0.167 },
  CAI: { city: "Cairo", name: "Cairo International", country: "Egypt", lat: 30.112, lon: 31.4 },
  CMN: { city: "Casablanca", name: "Mohammed V International", country: "Morocco", lat: 33.367, lon: -7.589 },
  NBO: { city: "Nairobi", name: "Jomo Kenyatta International", country: "Kenya", lat: -1.319, lon: 36.928 },
  JNB: { city: "Johannesburg", name: "O. R. Tambo International", country: "South Africa", lat: -26.139, lon: 28.246 },
  ADD: { city: "Addis Ababa", name: "Bole International", country: "Ethiopia", lat: 8.978, lon: 38.799 },
  DOH: { city: "Doha", name: "Hamad International", country: "Qatar", lat: 25.273, lon: 51.608 },
  DXB: { city: "Dubai", name: "Dubai International", country: "United Arab Emirates", lat: 25.253, lon: 55.365 },
  IST: { city: "Istanbul", name: "Istanbul Airport", country: "Turkiye", lat: 41.275, lon: 28.751 },
  LHR: { city: "London", name: "Heathrow", country: "United Kingdom", lat: 51.47, lon: -0.454 },
  LGW: { city: "London", name: "Gatwick", country: "United Kingdom", lat: 51.153, lon: -0.182 },
  CDG: { city: "Paris", name: "Charles de Gaulle", country: "France", lat: 49.009, lon: 2.547 },
  JFK: { city: "New York", name: "John F. Kennedy International", country: "United States", lat: 40.641, lon: -73.778 },
  EWR: { city: "Newark", name: "Newark Liberty International", country: "United States", lat: 40.689, lon: -74.174 },
  ATL: { city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", country: "United States", lat: 33.64, lon: -84.427 },
  ORD: { city: "Chicago", name: "O'Hare International", country: "United States", lat: 41.974, lon: -87.907 },
  LAX: { city: "Los Angeles", name: "Los Angeles International", country: "United States", lat: 33.942, lon: -118.408 },
  IAD: { city: "Washington", name: "Dulles International", country: "United States", lat: 38.953, lon: -77.456 },
  YYZ: { city: "Toronto", name: "Toronto Pearson International", country: "Canada", lat: 43.677, lon: -79.624 },
  AMS: { city: "Amsterdam", name: "Schiphol", country: "Netherlands", lat: 52.31, lon: 4.768 },
  FRA: { city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", lat: 50.037, lon: 8.562 },
  MUC: { city: "Munich", name: "Munich Airport", country: "Germany", lat: 48.354, lon: 11.786 },
  FCO: { city: "Rome", name: "Fiumicino", country: "Italy", lat: 41.8, lon: 12.238 },
  MAD: { city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain", lat: 40.498, lon: -3.568 },
  BCN: { city: "Barcelona", name: "Barcelona-El Prat", country: "Spain", lat: 41.297, lon: 2.078 },
  ZRH: { city: "Zurich", name: "Zurich Airport", country: "Switzerland", lat: 47.458, lon: 8.555 },
  DEL: { city: "Delhi", name: "Indira Gandhi International", country: "India", lat: 28.556, lon: 77.1 },
  BOM: { city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India", lat: 19.089, lon: 72.865 },
  SIN: { city: "Singapore", name: "Changi", country: "Singapore", lat: 1.364, lon: 103.991 }
};

const carriers = {
  P4: "Air Peace",
  QR: "Qatar Airways",
  EK: "Emirates",
  ET: "Ethiopian Airlines",
  TK: "Turkish Airlines",
  BA: "British Airways",
  VS: "Virgin Atlantic",
  AF: "Air France",
  KQ: "Kenya Airways",
  DL: "Delta Air Lines",
  AC: "Air Canada",
  UA: "United Airlines",
  LH: "Lufthansa",
  KL: "KLM Royal Dutch Airlines",
  MS: "Egyptair",
  AT: "Royal Air Maroc",
  EY: "Etihad Airways",
  SQ: "Singapore Airlines",
  AI: "Air India",
  IB: "Iberia",
  LX: "Swiss International Air Lines"
};

const airlineAliases = {
  EK: ["Emirates", "Emirate", "Fly Emirates", "Emirates Airline"],
  QR: ["Qatar Airways", "Qatar"],
  ET: ["Ethiopian Airlines", "Ethiopian"],
  TK: ["Turkish Airlines", "Turkish"],
  BA: ["British Airways"],
  VS: ["Virgin Atlantic"],
  AF: ["Air France"],
  KQ: ["Kenya Airways"],
  DL: ["Delta", "Delta Air Lines"],
  AC: ["Air Canada"],
  UA: ["United", "United Airlines"],
  P4: ["Air Peace"],
  LH: ["Lufthansa"],
  KL: ["KLM", "KLM Royal Dutch Airlines"],
  MS: ["Egyptair", "Egypt Air"],
  AT: ["Royal Air Maroc"],
  EY: ["Etihad", "Etihad Airways"],
  SQ: ["Singapore Airlines"],
  AI: ["Air India"],
  IB: ["Iberia"],
  LX: ["Swiss", "Swiss International"]
};

const seededRoutes = [
  { from: "LOS", to: "LHR", carrier: "P4", flight: "P47578", depart: "23:55", duration: 405, confidence: "Schedule matched" },
  { from: "LOS", to: "LHR", carrier: "VS", flight: "VS412", depart: "09:00", duration: 400, confidence: "Schedule matched" },
  { from: "LOS", to: "LGW", carrier: "BA", flight: "BA74", depart: "22:50", duration: 395, confidence: "Schedule matched" },
  { from: "LOS", to: "DXB", carrier: "EK", flight: "EK784", depart: "17:30", duration: 455, confidence: "Schedule matched" },
  { from: "LOS", to: "DOH", carrier: "QR", flight: "QR1406", depart: "19:00", duration: 505, confidence: "Schedule matched" },
  { from: "LOS", to: "ADD", carrier: "ET", flight: "ET900", depart: "13:40", duration: 325, confidence: "Schedule matched" },
  { from: "LOS", to: "IST", carrier: "TK", flight: "TK626", depart: "20:55", duration: 400, confidence: "Schedule matched" },
  { from: "LOS", to: "ACC", carrier: "P4", flight: "P47742", depart: "07:00", duration: 65, confidence: "Schedule matched" },
  { from: "ABV", to: "LHR", carrier: "BA", flight: "BA82", depart: "08:00", duration: 390, confidence: "Schedule matched" },
  { from: "ABV", to: "DOH", carrier: "QR", flight: "QR1432", depart: "13:15", duration: 445, confidence: "Schedule matched" },
  { from: "ABV", to: "ADD", carrier: "ET", flight: "ET950", depart: "13:25", duration: 285, confidence: "Schedule matched" },
  { from: "ACC", to: "LHR", carrier: "BA", flight: "BA78", depart: "22:20", duration: 395, confidence: "Schedule matched" },
  { from: "NBO", to: "LHR", carrier: "KQ", flight: "KQ100", depart: "09:05", duration: 535, confidence: "Schedule matched" },
  { from: "DXB", to: "LHR", carrier: "EK", flight: "EK1", depart: "07:45", duration: 455, confidence: "Schedule matched" },
  { from: "DOH", to: "JFK", carrier: "QR", flight: "QR701", depart: "08:05", duration: 845, confidence: "Schedule matched" },
  { from: "IST", to: "JFK", carrier: "TK", flight: "TK3", depart: "07:05", duration: 650, confidence: "Route matched" }
];

const hubs = ["DOH", "DXB", "ADD", "IST", "LHR", "CDG"];
const airportCityAliases = {
  DUBAI: "DXB",
  "ABU DHABI": "AUH",
  BAHRAIN: "BAH",
  "ADDIS ABABA": "ADD",
  DOHA: "DOH",
  LAGOS: "LOS",
  ABUJA: "ABV",
  LONDON: "LHR",
  PARIS: "CDG",
  ISTANBUL: "IST",
  NAIROBI: "NBO",
  ACCRA: "ACC",
  CAIRO: "CAI",
  CASABLANCA: "CMN",
  JOHANNESBURG: "JNB",
  AMSTERDAM: "AMS",
  FRANKFURT: "FRA",
  MUNICH: "MUC",
  ROME: "FCO",
  MADRID: "MAD",
  BARCELONA: "BCN",
  ZURICH: "ZRH",
  DELHI: "DEL",
  MUMBAI: "BOM",
  SINGAPORE: "SIN"
};
const currencyToUsd = {
  USD: 1,
  BHD: 2.65,
  NGN: 0.00065,
  GBP: 1.25,
  EUR: 1.08,
  AED: 0.272,
  QAR: 0.274
};
const currencyPrecision = {
  BHD: 3,
  JPY: 0,
  KRW: 0,
  NGN: 0,
  USD: 2,
  EUR: 2,
  GBP: 2,
  AED: 2,
  QAR: 2
};
const airportTimeZones = {
  JFK: "America/New_York",
  EWR: "America/New_York",
  ATL: "America/New_York",
  IAD: "America/New_York",
  ORD: "America/Chicago",
  LAX: "America/Los_Angeles",
  YYZ: "America/Toronto",
  LHR: "Europe/London",
  LGW: "Europe/London",
  CDG: "Europe/Paris",
  AMS: "Europe/Amsterdam",
  FRA: "Europe/Berlin",
  MUC: "Europe/Berlin",
  FCO: "Europe/Rome",
  MAD: "Europe/Madrid",
  BCN: "Europe/Madrid",
  ZRH: "Europe/Zurich",
  DXB: "Asia/Dubai",
  AUH: "Asia/Dubai",
  DOH: "Asia/Qatar",
  BAH: "Asia/Bahrain",
  IST: "Europe/Istanbul",
  ADD: "Africa/Addis_Ababa",
  NBO: "Africa/Nairobi",
  CAI: "Africa/Cairo",
  CMN: "Africa/Casablanca",
  JNB: "Africa/Johannesburg",
  DEL: "Asia/Kolkata",
  BOM: "Asia/Kolkata",
  SIN: "Asia/Singapore",
  LOS: "Africa/Lagos",
  ABV: "Africa/Lagos",
  PHC: "Africa/Lagos",
  ACC: "Africa/Accra"
};
const form = document.getElementById("itineraryForm");
const documentEl = document.getElementById("document");
const screenshotInput = document.getElementById("screenshotInput");
const ocrStatus = document.getElementById("ocrStatus");
const ocrText = document.getElementById("ocrText");
const parseOcrBtn = document.getElementById("parseOcrBtn");
const segmentRows = document.getElementById("segmentRows");
const addSegmentBtn = document.getElementById("addSegmentBtn");
const validationPanel = document.getElementById("validationPanel");

function init() {
  const preferredAirportOrder = ["JFK", "LHR", "CDG", "AMS", "FRA", "DXB", "DOH", "IST", "SIN", "YYZ", "LAX", "ORD"];
  const orderedAirports = [
    ...preferredAirportOrder.map((code) => [code, airports[code]]).filter(([, airport]) => airport),
    ...Object.entries(airports).filter(([code]) => !preferredAirportOrder.includes(code))
  ];
  const options = orderedAirports
    .map(([code, airport]) => `<option value="${code}">${code} - ${airport.city}</option>`)
    .join("");
  document.getElementById("origin").innerHTML = options;
  document.getElementById("destination").innerHTML = options;
  document.getElementById("origin").value = "JFK";
  document.getElementById("destination").value = "LHR";

  const today = new Date();
  const depart = addDays(today, 35);
  const ret = addDays(today, 49);
  document.getElementById("departDate").value = toInputDate(depart);
  document.getElementById("returnDate").value = toInputDate(ret);

  document.getElementById("multiCityRoutes").placeholder =
    `Optional. One segment per line, e.g.\nJFK LHR ${toInputDate(depart)}\nLHR CDG ${toInputDate(addDays(today, 42))}\nCDG JFK ${toInputDate(ret)}`;

  if (!readSegmentRows().length) {
    setSegmentRows([legFromRoute({
      from: "JFK",
      to: "LHR",
      carrier: "BA",
      flight: "BA112",
      depart: "18:30",
      duration: 420,
      confidence: "Flight details confirmed"
    }, document.getElementById("departDate").value)]);
  }
  generate();
}

function generate() {
  const data = Object.fromEntries(new FormData(form).entries());
  const reviewedTrips = buildTripsFromSegmentRows();
  const importedTrips = reviewedTrips || parseImportedDetails(data.importedDetails);
  const manualTrips = parseMultiCityRoutes(data.multiCityRoutes);
  const trips = importedTrips || manualTrips || buildDefaultTrips(data);
  const passengerNames = getPassengerNames(data);
  const passengers = Math.max(passengerNames.length, 1);
  const fare = getTicketFare(data.importedDetails);
  const estimate = estimateFare(trips, data.cabin, passengers, fare);
  const docId = makeDocId(data);
  const firstLeg = trips[0].legs[0];
  const lastTrip = trips[trips.length - 1];
  const lastLeg = lastTrip.legs[lastTrip.legs.length - 1];

  document.getElementById("routeTitle").textContent = `${firstLeg.from} to ${lastLeg.to}`;
  document.getElementById("confidenceTitle").textContent = "Booked flight itinerary";
  document.getElementById("docId").textContent = docId;
  documentEl.innerHTML = renderDocument({ data, trips, estimate, docId });
  renderValidation(data, readSegmentRows());
}

function buildDefaultTrips(data) {
  const outbound = buildTrip(data.origin, data.destination, data.departDate);
  outbound.title = "Outbound";
  if (!data.returnDate) return [outbound];

  const inbound = buildTrip(data.destination, data.origin, data.returnDate);
  inbound.title = "Return";
  return [outbound, inbound];
}

function parseMultiCityRoutes(value) {
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;

  const rejected = [];
  const trips = lines.map((line, index) => {
    const upper = line.toUpperCase();
    const codes = Object.keys(airports).filter((code) => new RegExp(`\\b${code}\\b`).test(upper));
    const date = findDate(line) || document.getElementById("departDate").value;
    if (codes.length < 2) {
      rejected.push(`line ${index + 1}: "${line}"`);
      return null;
    }
    const trip = buildTrip(codes[0], codes[1], date);
    trip.title = `Segment ${index + 1}`;
    return trip;
  }).filter(Boolean);

  if (rejected.length) {
    ocrStatus.textContent = `Warning: ${rejected.length} segment(s) skipped — no valid airport pair found in ${rejected.join("; ")}`;
  }

  return trips.length ? trips : null;
}

function buildTrip(origin, destination, date) {
  const direct = findSeeded(origin, destination);
  if (direct) {
    return {
      type: "Direct",
      confidence: direct.confidence,
      legs: [legFromRoute(direct, date)]
    };
  }

  const connection = hubs
    .map((hub) => [findSeeded(origin, hub), findSeeded(hub, destination)])
    .find(([first, second]) => first && second);

  if (connection) {
    const firstLeg = legFromRoute(connection[0], date);
    const secondDate = addMinutes(new Date(firstLeg.arrivalIso), 150);
    const secondLeg = legFromRoute(connection[1], toInputDate(secondDate), toTime(secondDate));
    return {
      type: "Connecting",
      confidence: "Connecting schedule matched",
      legs: [firstLeg, secondLeg]
    };
  }

  return generatedTrip(origin, destination, date);
}

async function runOcr(files) {
  const fileList = [...(files || [])];
  if (!fileList.length) return;
  if (!window.Tesseract) {
    ocrStatus.textContent = "OCR library unavailable. Paste screenshot text manually.";
    return;
  }

  ocrStatus.textContent = `Reading ${fileList.length} screenshot${fileList.length > 1 ? "s" : ""}...`;
  parseOcrBtn.disabled = true;

  try {
    const parts = [];
    for (const [index, file] of fileList.entries()) {
      const image = await preprocessImage(file);
      const text = await recognizeScreenshotWithFallback(image, index, fileList.length);
      parts.push(`Screenshot ${index + 1}\n${text}`);
    }
    ocrText.value = cleanupOcrText(parts.join("\n\n"));
    ocrStatus.textContent = "OCR complete. Review text, then apply details.";
  } catch (error) {
    ocrStatus.textContent = "OCR failed. Paste the screenshot text manually.";
  } finally {
    parseOcrBtn.disabled = false;
  }
}

function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(2, Math.max(1, 1800 / image.width));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < data.data.length; index += 4) {
        const avg = (data.data[index] + data.data[index + 1] + data.data[index + 2]) / 3;
        const boosted = avg > 188 ? 255 : avg < 92 ? 0 : Math.min(255, avg * 1.24);
        data.data[index] = boosted;
        data.data[index + 1] = boosted;
        data.data[index + 2] = boosted;
      }
      context.putImageData(data, 0, 0);
      canvas.toBlob((blob) => resolve(blob || file), "image/png");
    };
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

async function recognizeScreenshotWithFallback(image, index, total) {
  const attempts = [
    { name: "default", options: {} },
    { name: "dense text", options: { tessedit_pageseg_mode: "6", preserve_interword_spaces: "1" } },
    { name: "sparse text", options: { tessedit_pageseg_mode: "11", preserve_interword_spaces: "1" } }
  ];
  let bestText = "";

  for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex += 1) {
    const attempt = attempts[attemptIndex];
    const result = await Tesseract.recognize(image, "eng", {
      ...attempt.options,
      logger: (message) => {
        if (message.status === "recognizing text") {
          const pct = Math.round(message.progress * 100);
          ocrStatus.textContent = `Reading screenshot ${index + 1}/${total} (${attempt.name}) ${pct}%`;
        }
      }
    });
    const cleaned = cleanupOcrText(result?.data?.text || "");
    if (scoreOcrText(cleaned) > scoreOcrText(bestText)) bestText = cleaned;
    if (scoreOcrText(bestText) >= 20) break;
  }

  return bestText || "No readable text detected.";
}

function cleanupOcrText(text) {
  return normalizeWhitespace(
    String(text || "")
      .replace(/[|]/g, "I")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\S\r\n]+/g, " ")
      .split("\n")
      .map((line) => line.trim())
      .filter((line, index, all) => line && (index === 0 || line !== all[index - 1]))
      .join("\n")
  );
}

function scoreOcrText(text) {
  const value = String(text || "");
  if (!value) return 0;
  const words = value.split(/\s+/).filter(Boolean);
  const hasFlightSignals = (value.match(/\b([A-Z]{2}\s?\d{1,4}|AM|PM|[A-Z]{3}\b|\d{1,2}:\d{2})\b/g) || []).length;
  return words.length + hasFlightSignals * 3;
}

function applyOcrText() {
  const text = ocrText.value.trim();
  if (!text) {
    ocrStatus.textContent = "No OCR text to apply.";
    return;
  }

  const parsed = extractFlightFromText(text);
  const importedTrips = parseImportedDetails(text);
  const bookingRef = findBookingReference(text);
  const ticketNumber = findTicketNumber(text);
  const baggage = findBaggage(text);
  if (parsed.origin && airports[parsed.origin]) document.getElementById("origin").value = parsed.origin;
  if (parsed.destination && airports[parsed.destination]) document.getElementById("destination").value = parsed.destination;
  if (parsed.departDate) document.getElementById("departDate").value = parsed.departDate;
  if (bookingRef) document.getElementById("bookingRef").value = bookingRef;
  if (ticketNumber) document.getElementById("ticketNumber").value = ticketNumber;
  if (baggage) document.getElementById("baggage").value = baggage;
  if (parsed.routeCodes.length > 2) {
    document.getElementById("multiCityRoutes").value = parsed.routeCodes
      .slice(0, -1)
      .map((code, index) => `${code} ${parsed.routeCodes[index + 1]} ${parsed.departDate || document.getElementById("departDate").value}`)
      .join("\n");
  }

  document.getElementById("importedDetails").value = [
    parsed.airline ? `Airline: ${parsed.airline}` : "",
    parsed.flight ? `Flight: ${parsed.flight}` : "",
    parsed.routeCodes.length >= 2 ? `Route: ${parsed.routeCodes.join(" to ")}` : "",
    parsed.times.length ? `Times: ${parsed.times.join(", ")}` : "",
    parsed.duration ? `Duration: ${parsed.duration}` : "",
    parsed.layover ? `Layover: ${parsed.layover}` : "",
    parsed.price ? `Price: ${parsed.price}` : "",
    `Itinerary text: ${text}`
  ].filter(Boolean).join("\n");
  if (importedTrips) {
    setSegmentRows(importedTrips.flatMap((trip) => trip.legs));
  }

  ocrStatus.textContent = "Details applied. Review fields before generating.";
  generate();
}

function setSegmentRows(legs) {
  segmentRows.innerHTML = legs.map((leg) => renderSegmentRow(leg)).join("");
}

function renderSegmentRow(leg = {}) {
  return `
    <div class="segment-row">
      <input name="segAirline" placeholder="Airline" value="${escapeHtml(carriers[leg.carrier] || leg.airline || leg.carrier || "")}" />
      <input name="segFlight" placeholder="Flight" value="${escapeHtml(leg.flight || "")}" />
      <input name="segFrom" placeholder="From" value="${escapeHtml(leg.from || "")}" maxlength="3" />
      <input name="segTo" placeholder="To" value="${escapeHtml(leg.to || "")}" maxlength="3" />
      <input name="segDate" type="date" value="${escapeHtml(leg.departureIso ? leg.departureIso.slice(0, 10) : document.getElementById("departDate").value)}" />
      <input name="segDepart" type="time" value="${escapeHtml(leg.depart || "")}" />
      <input name="segArrive" type="time" value="${escapeHtml(leg.arrivalTime || "")}" />
      <input name="segArrivalOffset" type="number" min="0" max="3" placeholder="+days" value="${escapeHtml(leg.arrivalOffset || "")}" />
      <input name="segBaggage" placeholder="Baggage" value="${escapeHtml(leg.baggage || document.getElementById("baggage").value || "")}" />
      <input name="segDepartTerminal" placeholder="Dep terminal" value="${escapeHtml(leg.departTerminal || "")}" />
      <input name="segArriveTerminal" placeholder="Arr terminal" value="${escapeHtml(leg.arriveTerminal || "")}" />
      <input name="segLayover" placeholder="Layover detail" value="${escapeHtml(leg.layover || "")}" />
      <button type="button" class="remove-segment secondary">Remove</button>
    </div>
  `;
}

function readSegmentRows() {
  return [...segmentRows.querySelectorAll(".segment-row")].map((row) => {
    const get = (name) => row.querySelector(`[name="${name}"]`)?.value.trim() || "";
    return {
      airline: get("segAirline"),
      flight: get("segFlight"),
      from: get("segFrom").toUpperCase(),
      to: get("segTo").toUpperCase(),
      date: get("segDate"),
      depart: get("segDepart"),
      arrive: get("segArrive"),
      arrivalOffset: Number(get("segArrivalOffset") || 0),
      baggage: get("segBaggage"),
      departTerminal: get("segDepartTerminal"),
      arriveTerminal: get("segArriveTerminal"),
      layover: get("segLayover")
    };
  }).filter((segment) => segment.from && segment.to && segment.date && segment.depart);
}

function validateItinerary(data, rows) {
  const warnings = [];
  if (!getPassengerNames(data).length) warnings.push("Add at least one passenger name.");
  rows.forEach((segment, index) => {
    if (!airports[segment.from]) warnings.push(`Segment ${index + 1}: unknown origin airport ${segment.from}.`);
    if (!airports[segment.to]) warnings.push(`Segment ${index + 1}: unknown destination airport ${segment.to}.`);
    if (segment.flight && !/^[A-Z0-9]{2}\s?\d{1,4}[A-Z]?$/i.test(segment.flight)) {
      warnings.push(`Segment ${index + 1}: flight number format looks unusual.`);
    }
    if (segment.arrive && segment.arrive <= segment.depart && !segment.arrivalOffset) {
      warnings.push(`Segment ${index + 1}: arrival is before departure. Add +1 day if this is an overnight flight.`);
    }
  });
  const seen = new Set();
  rows.forEach((segment, index) => {
    const key = `${segment.flight}|${segment.from}|${segment.to}|${segment.date}|${segment.depart}`;
    if (seen.has(key)) warnings.push(`Segment ${index + 1}: duplicate segment appears in the itinerary.`);
    seen.add(key);
  });
  return warnings;
}

function renderValidation(data, rows) {
  const warnings = validateItinerary(data, rows);
  validationPanel.innerHTML = warnings.length
    ? `<strong>Review needed</strong>${warnings.map((warning) => `<span>${escapeHtml(warning)}</span>`).join("")}`
    : "";
}

function buildTripsFromSegmentRows() {
  const rows = readSegmentRows();
  if (!rows.length) return null;
  const legs = rows.map((segment) => {
    const carrier = carrierCodeFromName(segment.airline) || findCarrierCodeFromFlight(segment.flight) || "FT";
    const duration = segment.arrive ? calculateDuration(segment.depart, segment.arrive, segment.arrivalOffset) : generatedDuration(segment.from, segment.to);
    const leg = legFromRoute({
      from: segment.from,
      to: segment.to,
      carrier,
      flight: segment.flight || "Flight pending",
      depart: segment.depart,
      duration,
      arrivalOffset: segment.arrivalOffset,
      baggage: segment.baggage,
      departTerminal: segment.departTerminal,
      arriveTerminal: segment.arriveTerminal,
      layover: segment.layover,
      confidence: "Flight details confirmed"
    }, segment.date);
    return leg;
  });

  return [{
    title: legs.length > 1 ? "Flight itinerary" : "Flight segment",
    type: legs.length > 1 ? "Itinerary" : "Direct",
    confidence: "Flight details confirmed",
    legs
  }];
}

function extractFlightFromText(text) {
  return parseEmiratesText(text) || parseGenericFlightText(text);
}

function parseGenericFlightText(text) {
  const upper = text.toUpperCase();
  const codes = applyConnectionCodes(findAirportCodesInOrder(upper), upper);
  const routePair = findRoutePair(upper, codes);
  const airline = findAirline(text);
  const flightNumbers = findFlightNumbers(upper);
  const flight = flightNumbers[0] || "";
  const times = findTimes(text);
  const date = findDate(text);
  const duration = findDuration(text);
  const price = findPrice(text);
  const layover = findLayover(text);
  const fareRules = findFareRules(text);

  return {
    airline,
    flight,
    flightNumbers,
    routeCodes: codes.length >= 2 ? codes : routePair.filter(Boolean),
    origin: routePair[0],
    destination: routePair[1],
    departTime: times[0],
    arrivalTime: times[1],
    times,
    departDate: date,
    duration,
    price,
    layover,
    fareRules
  };
}

function parseEmiratesText(text) {
  if (!/EMIRATES|FLY EMIRATES|\bEK\s?\d/i.test(text)) return null;
  const upper = text.toUpperCase();
  const routeHeader = upper.match(/\b([A-Z][A-Z\s]+)\s*\(([A-Z]{3})\)\s*(?:→|>|TO|-)\s*([A-Z][A-Z\s]+)\s*\(([A-Z]{3})\)/);
  const routeCodes = routeHeader ? [routeHeader[2], routeHeader[4]] : findAirportCodesInOrder(upper);
  const connected = applyConnectionCodes(routeCodes, upper);
  const times = findTimes(text).filter((time, index, all) => all.indexOf(time) === index);
  const flightNumbers = findFlightNumbers(upper);
  const duration = findDuration(text);
  const price = findBestPrice(text);
  const fareRules = findFareRules(text);

  return {
    airline: "Emirates",
    flight: flightNumbers[0] || "",
    flightNumbers,
    routeCodes: connected.length >= 2 ? connected : routeCodes,
    origin: connected[0] || routeCodes[0] || null,
    destination: connected[connected.length - 1] || routeCodes[1] || null,
    departTime: times[0],
    arrivalTime: times[1],
    times,
    departDate: findDate(text),
    duration,
    price,
    layover: findLayover(text) || (connected.length > 2 ? `Connects in ${airports[connected[1]]?.city || connected[1]}` : ""),
    fareRules
  };
}

function parseImportedDetails(value) {
  if (!value.trim()) return null;
  const parsed = extractFlightFromText(value);
  if (parsed.routeCodes.length < 2) {
    if (parsed.routeCodes.length === 1) {
      ocrStatus.textContent = `Warning: only one airport code found (${parsed.routeCodes[0]}) — could not build route. Add destination manually.`;
    }
    return null;
  }

  const date = parsed.departDate || document.getElementById("departDate").value;
  const carrier = carrierCodeFromName(parsed.airline) || (parsed.flight || "XX").slice(0, 2).toUpperCase();
  const baggage = findBaggage(value);
  const terminals = findTerminals(value);
  const layoverDetail = parsed.layover || buildLayoverDetail(parsed.routeCodes, parsed.duration);
  const legs = parsed.routeCodes.slice(0, -1).map((from, index) => {
    const to = parsed.routeCodes[index + 1];
    const hasTotalTimesForConnection = parsed.routeCodes.length > 2 && parsed.times.length === 2;
    const depart = hasTotalTimesForConnection && index > 0
      ? estimateConnectionDeparture(parsed.times[0], parsed.routeCodes[0], from)
      : parsed.times[index * 2] || parsed.times[index] || pickDeparture(airports[from] && airports[to] ? distanceMiles(airports[from], airports[to]) : 1200);
    const arrival = hasTotalTimesForConnection && index === parsed.routeCodes.length - 2
      ? parsed.times[1]
      : parsed.times[index * 2 + 1] || "";
    const arrivalOffset = arrival ? inferArrivalOffset(depart, arrival, parsed.duration, parsed.routeCodes.length, index) : 0;
    const route = {
      from,
      to,
      carrier,
      flight: parsed.flightNumbers[index] || parsed.flight || "Flight pending",
      depart,
      duration: parsed.duration && parsed.routeCodes.length === 2
        ? durationToMinutes(parsed.duration)
        : arrival
          ? calculateDuration(depart, arrival, arrivalOffset)
          : generatedDuration(from, to),
      arrivalOffset,
      baggage,
      departTerminal: terminals.depart[index] || "",
      arriveTerminal: terminals.arrive[index] || "",
      layover: index === 0 && parsed.routeCodes.length > 2 ? layoverDetail : "",
      confidence: "Flight details confirmed"
    };
    return legFromRoute(route, date);
  });

  return groupImportedLegs(legs);
}

function groupImportedLegs(legs) {
  if (legs.length >= 2 && legs[0].from === legs[legs.length - 1].to) {
    const returnStart = legs.findIndex((leg, index) => index > 0 && leg.from === legs[0].to);
    if (returnStart > 0) {
      return [
        { title: "Outbound", type: "Confirmed", confidence: "Flight details confirmed", legs: legs.slice(0, returnStart) },
        { title: "Return", type: "Confirmed", confidence: "Flight details confirmed", legs: legs.slice(returnStart) }
      ];
    }
  }
  return [{
    title: legs.length > 1 ? "Flight itinerary" : "Flight segment",
    type: legs.length > 1 ? "Itinerary" : "Direct",
    confidence: "Flight details confirmed",
    legs
  }];
}

function findAirportCodesInOrder(upper) {
  const found = [];
  const codePattern = /\b[A-Z]{3}\b/g;
  let match;
  while ((match = codePattern.exec(upper))) {
    const code = match[0];
    if (airports[code] && found[found.length - 1] !== code) found.push(code);
  }
  return found;
}

function applyConnectionCodes(codes, upper) {
  const nextCodes = [...codes];
  Object.entries(airportCityAliases).forEach(([city, code]) => {
    const isConnection = new RegExp(`\\b(CONNECTS|CONNECTING|LAYOVER|STOP|STOPOVER)\\s+(?:IN|AT)?\\s*${city}\\b`).test(upper);
    if (isConnection && nextCodes.length >= 2 && !nextCodes.includes(code)) {
      nextCodes.splice(1, 0, code);
    }
  });
  return nextCodes;
}

function findRoutePair(upper, codes) {
  const routeMatch = upper.match(/\b([A-Z]{3})\b\s*(?:-|TO|→|>)\s*\b([A-Z]{3})\b/);
  if (routeMatch && airports[routeMatch[1]] && airports[routeMatch[2]]) {
    return [routeMatch[1], routeMatch[2]];
  }
  if (codes.length >= 2) return [codes[0], codes[1]];
  return [null, null];
}

function findAirline(text) {
  const normalized = normalizeOcrToken(text);
  const match = Object.entries(airlineAliases).find(([, aliases]) => (
    aliases.some((alias) => normalized.includes(normalizeOcrToken(alias)))
  ));
  if (match) return carriers[match[0]];
  return Object.values(carriers).find((name) => new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)) || "";
}

function findFlightNumber(upper) {
  return findFlightNumbers(upper)[0] || "";
}

function findFlightNumbers(upper) {
  const knownCarrierCodes = Object.keys(carriers).join("|");
  const cleaned = upper.replace(/\bE\s*K\b/g, "EK").replace(/\bQ\s*R\b/g, "QR");
  const matches = cleaned.match(new RegExp(`\\b(${knownCarrierCodes})\\s?\\d{1,4}\\b`, "g")) || [];
  return [...new Set(matches.map((match) => match.replace(/\s+/, "")))];
}

function findTimes(text) {
  const matches = text.match(/\b(?:[01]?\d|2[0-3])[:.]?[0-5]\d\s?(?:AM|PM)?\b/gi) || [];
  return matches.map(normalizeTime);
}

function normalizeTime(value) {
  const clean = value.trim().replace(".", ":").toUpperCase();
  const ampm = clean.match(/(AM|PM)$/);
  const numeric = clean.replace(/\s?(AM|PM)$/i, "");
  const [hourRaw, minuteRaw] = numeric.includes(":")
    ? numeric.split(":")
    : [numeric.slice(0, -2), numeric.slice(-2)];
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (ampm?.[1] === "PM" && hour < 12) hour += 12;
  if (ampm?.[1] === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function findDate(text) {
  const iso = text.match(/\b20\d{2}-[01]\d-[0-3]\d\b/);
  if (iso) return iso[0];

  const slash = text.match(/\b([0-3]?\d)[/.-]([01]?\d)[/.-](20\d{2})\b/);
  if (slash) return `${slash[3]}-${slash[2].padStart(2, "0")}-${slash[1].padStart(2, "0")}`;

  const named = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+([0-3]?\d),?\s+(20\d{2})\b/i);
  if (named) {
    const month = new Date(`${named[1]} 1, ${new Date().getFullYear()}`).getMonth() + 1;
    return `${named[3]}-${String(month).padStart(2, "0")}-${named[2].padStart(2, "0")}`;
  }

  return "";
}

function findDuration(text) {
  const match = text.match(/\b(\d{1,2})\s?h(?:ours?)?\s?(\d{1,2})?\s?m?/i);
  if (!match) return "";
  return `${match[1]}h ${match[2] || 0}m`;
}

function findPrice(text) {
  const match = text.match(/(?:USD|BHD|NGN|GBP|EUR|AED|QAR|\$|₦|£|€)\s?[\d,]+(?:\.\d{2,3})?/i);
  return match ? match[0] : "";
}

function findBestPrice(text) {
  const matches = text.match(/(?:USD|BHD|NGN|GBP|EUR|AED|QAR|\$|₦|£|€)\s?[\d,]+(?:\.\d{2,3})?/gi) || [];
  if (!matches.length) return "";
  const totalMatch = matches.find((match) => new RegExp(`(TOTAL|COST|FARE|TO BE PAID).{0,30}${escapeRegExp(match)}`, "i").test(text));
  return totalMatch || matches[matches.length - 1];
}

function findFareScope(text, price) {
  if (!price) return "unknown";
  const escaped = escapeRegExp(price);
  if (new RegExp(`(TOTAL|TO BE PAID|GRAND TOTAL|AMOUNT DUE).{0,50}${escaped}|${escaped}.{0,50}(TOTAL|TO BE PAID|GRAND TOTAL|AMOUNT DUE)`, "i").test(text)) {
    return "total";
  }
  if (new RegExp(`(PER PASSENGER|PER ADULT|/\\s*PASSENGER|EACH).{0,50}${escaped}|${escaped}.{0,50}(PER PASSENGER|PER ADULT|/\\s*PASSENGER|EACH)`, "i").test(text)) {
    return "per-passenger";
  }
  return "unknown";
}

function findLayover(text) {
  const match = text.match(/\b(?:layover|stopover|connection)\b.{0,40}/i);
  return match ? match[0].trim() : "";
}

function buildLayoverDetail(routeCodes, durationText) {
  if (routeCodes.length <= 2) return "";
  const connection = airports[routeCodes[1]]?.city || routeCodes[1];
  return durationText ? `Connection in ${connection}; total journey ${durationText}` : `Connection in ${connection}`;
}

function findFareRules(text) {
  const rules = [];
  const patterns = [
    ["Change fee", /\bchange fee[:\s]+([A-Z]{3}|\$|₦|£|€)?\s?[\d,]+(?:\.\d{2,3})?/i],
    ["Refund fee", /\brefund fee[:\s]+([A-Z]{3}|\$|₦|£|€)?\s?[\d,]+(?:\.\d{2,3})?/i],
    ["No-show penalty", /\bno-show penalty[:\s]+[\s\S]{0,120}?(?=\n[A-Z][a-z]|\n\n|$)/i],
    ["Checked baggage", /\bchecked baggage[:\s]+[^\n]+/i],
    ["Fare brand", /\b(economy flex|economy saver|business flex|business saver|premium economy)[^\n]*/i]
  ];
  patterns.forEach(([label, pattern]) => {
    const match = text.match(pattern);
    if (match) rules.push(`${label}: ${match[0].replace(new RegExp(`^${label}:?\\s*`, "i"), "").trim()}`);
  });
  return [...new Set(rules)];
}

function findTerminals(text) {
  const depart = [];
  const arrive = [];
  const terminalMatches = text.match(/\b(?:terminal|term\.?|T)\s*([A-Z0-9]+)\b/gi) || [];
  terminalMatches.forEach((match, index) => {
    const terminal = match.match(/([A-Z0-9]+)$/i)?.[1] || "";
    if (index % 2 === 0) depart.push(terminal);
    else arrive.push(terminal);
  });
  return { depart, arrive };
}

function findBaggage(text) {
  const match = text.match(/\b(?:checked baggage|baggage|bags?)[:\s]+([0-9]\s*x\s*[0-9]{1,2}\s*kg|[0-9]{1,2}\s*kg|[0-9]\s*pieces?)/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function findBookingReference(text) {
  const match = text.match(/\b(?:PNR|booking reference|reservation code|reference)[:\s#-]+([A-Z0-9]{5,8})\b/i);
  return match ? match[1].toUpperCase() : "";
}

function findTicketNumber(text) {
  const match = text.match(/\b(?:ticket number|e-ticket|ticket)[:\s#-]+([0-9]{10,14})\b/i);
  return match ? match[1] : "";
}

function durationToMinutes(value) {
  const match = value.match(/(\d{1,2})h\s?(\d{1,2})?m?/i);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2] || 0);
}

function calculateDuration(start, end, arrivalOffset = 0) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  let minutes = endHour * 60 + endMinute + arrivalOffset * 1440 - (startHour * 60 + startMinute);
  if (minutes <= 0) minutes += 1440;
  return minutes;
}

function inferArrivalOffset(depart, arrive, durationText, totalSegments, index) {
  if (/\+\s*([1-3])/.test(durationText || "")) return Number(durationText.match(/\+\s*([1-3])/)?.[1]);
  const base = calculateDuration(depart, arrive, 0);
  if (totalSegments === 1 && durationText) {
    const target = durationToMinutes(durationText);
    if (target && target - base > 720) return Math.round((target - base) / 1440);
  }
  return arrive <= depart && (totalSegments === 1 || index === totalSegments - 2) ? 1 : 0;
}

function estimateConnectionDeparture(firstDepart, origin, connection) {
  const [hour, minute] = firstDepart.split(":").map(Number);
  const firstLegMinutes = generatedDuration(origin, connection);
  const nextDepart = addMinutes(
    new Date(`2026-01-01T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`),
    firstLegMinutes + 120
  );
  return toTime(nextDepart);
}

function carrierCodeFromName(name) {
  return Object.entries(carriers).find(([, carrierName]) => carrierName === name)?.[0];
}

function findCarrierCodeFromFlight(flight) {
  return String(flight || "").toUpperCase().match(/^[A-Z0-9]{2}/)?.[0] || "";
}

function normalizeWhitespace(value) {
  return value.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function normalizeOcrToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generatedTrip(origin, destination, date) {
  const distance = distanceMiles(airports[origin], airports[destination]);
  const duration = generatedDuration(origin, destination);
  const carrier = pickCarrier(origin, destination);
  const route = {
    from: origin,
    to: destination,
    carrier,
    flight: `${carrier}${Math.floor(100 + seededNumber(origin + destination) % 8000)}`,
    depart: pickDeparture(distance),
    duration,
    confidence: "Route-based schedule"
  };
  return { type: "Direct", confidence: route.confidence, legs: [legFromRoute(route, date)] };
}

function generatedDuration(origin, destination) {
  if (!airports[origin] || !airports[destination]) return 120;
  const distance = distanceMiles(airports[origin], airports[destination]);
  return Math.max(55, Math.round((distance / 500) * 60 + 45));
}

function findSeeded(from, to) {
  return seededRoutes.find((route) => route.from === from && route.to === to);
}

function legFromRoute(route, date, overrideDepart) {
  const depart = overrideDepart || route.depart;
  const departureIso = `${date}T${depart}:00`;
  const arrival = addMinutes(new Date(departureIso), route.duration);
  return {
    ...route,
    depart,
    departureIso,
    arrivalIso: arrival.toISOString(),
    arrivalDate: toDisplayDate(arrival),
    arrivalTime: toTime(arrival),
    durationText: formatDuration(route.duration)
  };
}

function renderDocument({ data, trips, estimate, docId }) {
  const firstLeg = trips[0].legs[0];
  const lastTrip = trips[trips.length - 1];
  const lastLeg = lastTrip.legs[lastTrip.legs.length - 1];
  const origin = airports[firstLeg.from];
  const destination = airports[lastLeg.to];
  const generatedAt = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const passengerNames = getPassengerNames(data);
  const passengerCount = Math.max(passengerNames.length, 1);
  const primaryAirline = carriers[firstLeg.carrier] || firstLeg.carrier || "Airline";
  const primaryCode = firstLeg.carrier || "FT";
  const primaryLogo = airlineLogoSources(primaryCode);
  const fareRules = getFareRules(data.importedDetails);

  return `
    <header class="doc-header">
      <div class="airline-brand">
        <span class="airline-logo">
          ${primaryLogo.primary ? `<img src="${primaryLogo.primary}" data-fallback-src="${primaryLogo.fallback}" data-secondary-fallback-src="${primaryLogo.secondaryFallback}" alt="${escapeHtml(primaryAirline)} logo" onload="this.parentElement.classList.add('logo-loaded')" onerror="swapLogoSource(this)" />` : ""}
          <b>${escapeHtml(primaryCode)}</b>
        </span>
        <div>
          <span class="eyebrow">Flight itinerary</span>
          <h2>${escapeHtml(primaryAirline)}</h2>
          <p>${origin.city}, ${origin.country} to ${destination.city}, ${destination.country}</p>
        </div>
      </div>
      <div class="doc-meta">
        <strong>${docId}</strong>
        <span>Issue date ${generatedAt}</span>
      </div>
    </header>

    <section class="summary-grid">
      <div><span>Passengers</span><strong>${passengerCount}</strong></div>
      <div><span>Cabin</span><strong>${label(data.cabin)}</strong></div>
      <div><span>Payment status</span><strong>Paid</strong></div>
      <div><span>Total fare</span><strong>${formatFare(estimate)}</strong></div>
    </section>

    ${renderBookingDetails(data)}
    ${renderJourneySummary(trips)}

    ${renderPassengerList(passengerNames)}
    ${trips.map((trip, index) => renderTrip(trip.title || `Segment ${index + 1}`, trip)).join("")}

    ${renderFareRules(fareRules)}
    ${renderCheckInGuidance(trips)}

    <section class="fare-box">
      <div>
        <h3>Total fare</h3>
        <p>Fare amount shown for the listed passenger(s).</p>
      </div>
      <div class="fare-total">${formatFare(estimate)}</div>
    </section>

    <section class="notice">
      <h3>Document note</h3>
      <p>${escapeHtml(data.agencyNote)}</p>
    </section>
  `;
}

function renderJourneySummary(trips) {
  const legs = trips.flatMap((trip) => trip.legs);
  const duration = legs.reduce((total, leg) => total + (leg.duration || 0), 0);
  const layovers = legs.map((leg) => leg.layover).filter(Boolean);
  return `
    <section class="detail-grid">
      <div><span>Trip type</span><strong>${tripTypeLabel(trips)}</strong></div>
      <div><span>Total flight time</span><strong>${formatDuration(duration)}</strong></div>
      <div><span>Layover</span><strong>${layovers[0] ? escapeHtml(layovers[0]) : "None listed"}</strong></div>
    </section>
  `;
}

function renderFareRules(rules) {
  if (!rules.length) return "";
  return `
    <section class="fare-rules">
      <h3>Fare rules</h3>
      ${rules.map((rule) => `<p>${escapeHtml(rule)}</p>`).join("")}
    </section>
  `;
}

function renderCheckInGuidance(trips) {
  const firstLeg = trips[0].legs[0];
  const airport = airports[firstLeg.from]?.city || firstLeg.from;
  return `
    <section class="notice">
      <h3>Check-in guidance</h3>
      <p>Online check-in is usually available 24 to 48 hours before departure. Arrive at ${airport} airport at least 3 hours before international departure with valid travel documents.</p>
    </section>
  `;
}

function renderBookingDetails(data) {
  const items = [
    data.bookingRef ? `<div><span>Booking reference</span><strong>${escapeHtml(data.bookingRef)}</strong></div>` : "",
    data.ticketNumber ? `<div><span>Ticket number</span><strong>${escapeHtml(data.ticketNumber)}</strong></div>` : "",
    data.baggage ? `<div><span>Baggage</span><strong>${escapeHtml(data.baggage)}</strong></div>` : ""
  ].filter(Boolean);
  if (!items.length) return "";
  return `<section class="detail-grid">${items.join("")}</section>`;
}

function airlineLogoSources(code) {
  const cleanCode = String(code || "").toUpperCase().match(/[A-Z0-9]{2}/)?.[0];
  if (!cleanCode) return { primary: "", fallback: "" };
  return {
    primary: `assets/logos/${cleanCode}.png`,
    fallback: `https://www.gstatic.com/flights/airline_logos/70px/${cleanCode}.png`,
    secondaryFallback: `https://content.airhex.com/content/logos/airlines_${cleanCode}_350_100_r.png`
  };
}

function swapLogoSource(image) {
  const fallback = image.dataset.fallbackSrc;
  const secondaryFallback = image.dataset.secondaryFallbackSrc;
  if (fallback && image.src !== fallback) {
    image.removeAttribute("data-fallback-src");
    image.dataset.fallbackSrc = secondaryFallback || "";
    image.src = fallback;
    return;
  }
  image.remove();
}

function renderPassengerList(passengerNames) {
  const list = passengerNames.length
    ? passengerNames
    : ["Passenger 1"];
  return `
    <section class="passengers">
      <h3>Passengers</h3>
      <div class="passenger-list">
        ${list.map((name, index) => `<span>${index + 1}. ${escapeHtml(name)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderTrip(title, trip) {
  return `
    <section class="trip">
      <div class="trip-heading">
        <h3>${title}</h3>
        <span>${trip.type}</span>
      </div>
      ${trip.legs.map(renderLeg).join("")}
    </section>
  `;
}

function renderLeg(leg, index) {
  const from = airports[leg.from] || { city: leg.from, country: "" };
  const to = airports[leg.to] || { city: leg.to, country: "" };
  const departDate = toDisplayDate(new Date(leg.departureIso));
  return `
    <div class="leg">
      <div class="leg-number">${index + 1}</div>
      <div class="flight">
        <strong>${escapeHtml(carriers[leg.carrier] || leg.carrier)}</strong>
        <span>${escapeHtml(leg.flight)} · ${leg.durationText}</span>
      </div>
      <div class="airport">
        <strong>${leg.from}</strong>
        <span>${from.city}</span>
        <em>${departDate}, ${leg.depart}${airportTimeZones[leg.from] ? ` (${airportTimeZones[leg.from]})` : ""}${leg.departTerminal ? ` · Terminal ${escapeHtml(leg.departTerminal)}` : ""}</em>
      </div>
      <div class="line"></div>
      <div class="airport">
        <strong>${leg.to}</strong>
        <span>${to.city}</span>
        <em>${leg.arrivalDate}, ${leg.arrivalTime}${leg.arrivalOffset ? ` +${leg.arrivalOffset}` : ""}${airportTimeZones[leg.to] ? ` (${airportTimeZones[leg.to]})` : ""}${leg.arriveTerminal ? ` · Terminal ${escapeHtml(leg.arriveTerminal)}` : ""}</em>
      </div>
      ${leg.baggage ? `<div class="leg-baggage">Baggage: ${escapeHtml(leg.baggage)}</div>` : ""}
      ${leg.layover ? `<div class="leg-baggage">Layover: ${escapeHtml(leg.layover)}</div>` : ""}
    </div>
  `;
}

function estimateFare(trips, cabin, passengers, fare) {
  if (fare?.amount) {
    const sourcePassengers = fare.passengers || 1;
    const multiplier = fare.scope === "total" ? 1 : Math.max(passengers, 1) / sourcePassengers;
    const totalAmount = fare.amount * multiplier;
    return {
      total: Math.round(totalAmount * 1000) / 1000,
      currency: fare.currency,
      source: "Total fare",
      note: "Fare amount shown for the listed passenger(s)."
    };
  }

  const legs = trips.flatMap((trip) => trip.legs);
  const miles = legs.reduce((total, leg) => {
    if (!airports[leg.from] || !airports[leg.to]) return total;
    return total + distanceMiles(airports[leg.from], airports[leg.to]);
  }, 0);
  const cabinMultiplier = { economy: 1, premium: 1.65, business: 3.8 }[cabin] || 1;
  const base = 95 + miles * 0.115;
  const total = Math.round((base * cabinMultiplier * passengers) / 10) * 10;
  return {
    total,
    currency: "USD",
    source: "Total fare",
    note: "Fare amount shown for the listed passenger(s)."
  };
}

function getPassengerNames(data) {
  const names = data.passengerNames
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);
  return names;
}

function tripTypeLabel(trips) {
  if (trips.length > 2 || trips.some((trip) => trip.legs.length > 1)) return "Multi-city";
  if (trips.length === 2) return "Round trip";
  return "One way";
}

function getTicketPrice(value) {
  if (!value) return null;
  const parsed = extractFlightFromText(value);
  return parsePrice(parsed.price)?.usd || null;
}

function getTicketFare(value) {
  if (!value) return null;
  const parsed = extractFlightFromText(value);
  const fare = parsePrice(parsed.price);
  if (!fare) return null;
  fare.passengers = findPassengerCount(value) || 1;
  fare.scope = findFareScope(value, parsed.price);
  return fare;
}

function getFareRules(value) {
  if (!value) return [];
  return extractFlightFromText(value).fareRules || [];
}

function parsePrice(value) {
  if (!value) return null;
  const currency = value.match(/[A-Z]{3}|\$|₦|£|€/)?.[0] || "USD";
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const symbolRates = { "$": 1, "₦": currencyToUsd.NGN, "£": currencyToUsd.GBP, "€": currencyToUsd.EUR };
  const rate = symbolRates[currency] || currencyToUsd[currency] || 1;
  return {
    amount: numeric,
    currency,
    usd: Math.round(numeric * rate),
    original: `${currency} ${numeric.toLocaleString("en-US", { maximumFractionDigits: 3 })}`
  };
}

function findPassengerCount(value) {
  const match = String(value || "").match(/\b(\d+)\s+passenger/i);
  return match ? Number(match[1]) : null;
}

function formatFare(fare) {
  const currency = fare.currency || "USD";
  const normalizedCurrency = currency === "$" ? "USD" : currency === "£" ? "GBP" : currency === "€" ? "EUR" : currency === "₦" ? "NGN" : currency;
  const digits = currencyPrecision[normalizedCurrency] ?? 2;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  return formatter.format(fare.total);
}

function distanceMiles(a, b) {
  const rad = Math.PI / 180;
  const r = 3958.8;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

function pickCarrier(origin, destination) {
  const pair = origin + destination;
  const pool = ["QR", "EK", "ET", "TK", "AF", "KQ"];
  return pool[seededNumber(pair) % pool.length];
}

function pickDeparture(distance) {
  if (distance > 4500) return "22:30";
  if (distance > 2500) return "13:45";
  return "09:20";
}

function seededNumber(value) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function makeDocId(data) {
  const seed = `${data.passengerNames}${data.origin}${data.destination}${data.departDate}`;
  let hash = 0x811c9dc5;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = (hash * 0x01000193) >>> 0;
  }
  return `FTX-${hash.toString(36).toUpperCase().padStart(7, "0")}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toTime(date) {
  return date.toTimeString().slice(0, 5);
}

function formatDuration(minutes) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function label(value) {
  return value.replace(/^\w/, (match) => match.toUpperCase());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function resetForm() {
  document.getElementById("passengerNames").value = "";
  document.getElementById("importedDetails").value = "";
  document.getElementById("multiCityRoutes").value = "";
  document.getElementById("ocrText").value = "";
  segmentRows.innerHTML = "";
  screenshotInput.value = "";
  ocrStatus.textContent = "OCR ready";
  init();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generate();
});

document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("resetBtn").addEventListener("click", resetForm);
addSegmentBtn.addEventListener("click", () => {
  segmentRows.insertAdjacentHTML("beforeend", renderSegmentRow());
});
segmentRows.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-segment")) {
    event.target.closest(".segment-row")?.remove();
    generate();
  }
});
segmentRows.addEventListener("input", generate);
screenshotInput.addEventListener("change", (event) => runOcr(event.target.files));
parseOcrBtn.addEventListener("click", applyOcrText);

init();
