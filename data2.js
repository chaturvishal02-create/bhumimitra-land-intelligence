/* BhumiMitra — demo data layer, part 2: regions, research corpus, policy notes, presets, extra AI intents. */
"use strict";

/* ---------------- Demo user & regions (GIS Explorer / Twin) ---------------- */
const DEMO_USER = { name: "Demo User", role: "Government Researcher", organization: "BhumiMitra Research Lab", status: "Demo Account", demo: true };

const REGIONS_TREE = {
  MH: { name: "Maharashtra", districts: { "Pune": ["Haveli", "Mulshi", "Wagholi"], "Raigad": ["Khalapur", "Pen"], "Ahmednagar": ["Sangamner", "Shrirampur"] } },
  KA: { name: "Karnataka", districts: { "Bengaluru Rural": ["Devanahalli", "Hosakote"], "Mysuru": ["Nanjangud", "T. Narasipura"] } },
  GJ: { name: "Gujarat", districts: { "Ahmedabad": ["Dholka", "Sanand"], "Surat": ["Bardoli", "Mandvi"] } },
  TG: { name: "Telangana", districts: { "Warangal": ["Hanamkonda", "Dharmasagar"], "Rangareddy": ["Shamshabad", "Ibrahimpatnam"] } },
  MP: { name: "Madhya Pradesh", districts: { "Bhopal": ["Phanda", "Berasia"], "Indore": ["Depalpur", "Mhow"] } },
};

const REGION_COORDS = {
  Haveli: [18.4772, 73.9143], Mulshi: [18.4921, 73.7312], Wagholi: [18.5108, 73.9902],
  Khalapur: [18.8037, 73.3299], Pen: [18.7401, 73.0980], Sangamner: [19.5746, 74.2115], Shrirampur: [19.6301, 74.6501],
  Devanahalli: [13.2463, 77.7129], Hosakote: [13.0693, 77.7952], Nanjangud: [12.1182, 76.6831], "T. Narasipura": [12.2104, 76.9004],
  Dholka: [22.7226, 72.7215], Sanand: [22.9947, 72.3842], Bardoli: [21.1251, 73.1117], Mandvi: [21.2072, 73.0414],
  Hanamkonda: [17.9993, 79.5782], Dharmasagar: [17.9593, 79.5326], Shamshabad: [17.2487, 78.4408], Ibrahimpatnam: [17.1006, 78.4512],
  Phanda: [23.1004, 77.2010], Berasia: [23.6304, 77.4302], Depalpur: [22.6617, 75.7035], Mhow: [22.5608, 75.7544],
};

function hashStr2(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng2(seed) {
  return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function regionMetrics(stateCode, region) {
  const st = STATES[stateCode];
  const rnd = rng2(hashStr2(stateCode + region));
  const urbanBias = st.urbanExpansion / 18;
  return {
    coords: REGION_COORDS[region] || st.center,
    agri: Math.round((st.landUse.agri[2] + (rnd() * 12 - 6)) * 10) / 10,
    urbanGrowth: Math.round(st.urbanExpansion * (0.6 + rnd() * 0.9 * urbanBias) * 10) / 10,
    climateRisk: Math.round((st.climate.drought + st.climate.heat) / 2 + (rnd() * 16 - 8)),
    waterStress: Math.max(15, Math.min(95, Math.round(st.climate.waterStress + (rnd() * 20 - 10)))),
    disputes: Math.round(st.disputeDensity * (0.5 + rnd()) * 10) / 10,
    infra: Math.round(st.infraIndex * (0.75 + rnd() * 0.5)),
    population: Math.round((8 + rnd() * 90) * 1000),
    forest: Math.round(st.landUse.forest[2] * (0.5 + rnd()) * 10) / 10,
  };
}

/* PAST -> PRESENT -> FUTURE for the Digital Land Twin (region level) */
function regionTwinData(stateCode, region) {
  const m = regionMetrics(stateCode, region);
  const st = STATES[stateCode];
  return {
    past: { year: 2015, agri: st.landUse.agri[0], urban: st.landUse.urban[0], water: Math.max(10, m.waterStress - 18), disputes: Math.round(m.disputes * 6) / 10, infra: Math.round(m.infra * 0.6), note: "Pre-ULPIN era: textual RoR digitized, spatial layers sparse." },
    present: { year: 2025, agri: m.agri, urban: st.landUse.urban[2], water: m.waterStress, disputes: m.disputes, infra: m.infra, note: "ULPIN coverage ~complete; PVI v1 and RCCMS analytics live (demo)." },
    future: { year: 2035, agri: Math.round((m.agri - m.urbanGrowth * 0.45) * 10) / 10, urban: Math.round((st.landUse.urban[2] + m.urbanGrowth * 0.5) * 10) / 10, water: Math.min(98, m.waterStress + 9), disputes: Math.round(m.disputes * 11.5) / 10, infra: Math.min(99, Math.round(m.infra * 1.28)), note: "Projection under current-policy continuation (demo ABM median path)." },
  };
}

/* ---------------- Research Hub corpus ---------------- */
const RESEARCH = [
  { id: "r1", title: "Peri-Urban Transformation of the Pune Metropolitan Fringe", year: 2024, source: "Demo Repository · Journal of Land Governance", state: "MH", topic: "Urban Expansion", type: "Journal Paper", location: "Pune, Maharashtra", summary: "Change-detection analysis of Haveli–Mulshi shows agricultural cover contracting 4.4 pts in a decade, with conversion clustering within 2 km of corridor notifications. Circle-rate deltas lead litigation surges by 2–3 years.", datasets: ["LULC Change Detection 2015–2025 (demo)", "Circle-Rate Delta Series (demo)"], layers: ["Urban Expansion Layer", "Conversion Pressure Layer"] },
  { id: "r2", title: "Climate-Land Nexus: Parcel-Level Vulnerability in Semi-Arid India", year: 2025, source: "Demo Repository · Climate Policy Review", state: "MH", topic: "Climate Risk", type: "Journal Paper", location: "Ahmednagar, Maharashtra", summary: "Parcel Vulnerability Index (PVI) fuses groundwater decline, SOC loss and NDVI volatility. Semi-arid taluks show a degradation feedback loop: water stress to extractive monoculture to SOC loss to worse infiltration.", datasets: ["Parcel Vulnerability Index v1 (demo)", "CGWB Groundwater Series (demo)"], layers: ["PVI Layer", "Groundwater Decline Layer"] },
  { id: "r3", title: "Bengaluru's Northern Growth Corridor: Land-Use Spillover Study", year: 2023, source: "Demo Repository · Urban Policy Working Papers", state: "KA", topic: "Urban Expansion", type: "Policy Brief", location: "Devanahalli, Karnataka", summary: "Airport-proximity parcels experienced 3.1x transaction velocity versus district median after infrastructure notification; fragmentation indices rose 14% as holdings subdivided for plotted development.", datasets: ["Transaction Velocity Panel (demo)"], layers: ["Urban Expansion Layer", "Infrastructure Layer"] },
  { id: "r4", title: "Dholera SIR Land Banking: Speculation Metrics and Guardrails", year: 2024, source: "Demo Repository · Infrastructure Finance Quarterly", state: "GJ", topic: "Infrastructure", type: "Case Study", location: "Dholka, Gujarat", summary: "Simulated land-banking cycles around the Dholera Special Investment Region show speculation peaks 18–24 months post-notification; circle-rate lag is the primary amplifier. Recommends automated rate revision triggers.", datasets: ["Circle-Rate Delta Series (demo)", "Registered Deeds Extract (demo)"], layers: ["Infrastructure Layer", "Market-Wedge Layer"] },
  { id: "r5", title: "Inheritance Informality and Title Disputes in Telangana", year: 2025, source: "Demo Repository · Land Rights Review", state: "TG", topic: "Disputes", type: "Journal Paper", location: "Warangal, Telangana", summary: "Death-to-mutation lag is the single largest predictor of RCCMS pendency in the demo panel. Auto-mutation camps linked to Dharani reduced new filings 22% in simulation.", datasets: ["Death-Mutation Lag Panel (demo)", "RCCMS Case Lifecycle Extract (demo)"], layers: ["Litigation-Surge Heatmap"] },
  { id: "r6", title: "Soil Carbon Dynamics under Water Stress: MP Black Cotton Belt", year: 2023, source: "Demo Repository · Agricultural Science Letters", state: "MP", topic: "Agriculture", type: "Journal Paper", location: "Bhopal, Madhya Pradesh", summary: "SOC declined 0.6 pts across 2015–2025 in water-stressed wheat–soybean parcels; SHC advisories with diversification recommendations showed measurable slowing in compliant clusters.", datasets: ["Soil Health Card Panel 2015–2025 (demo)"], layers: ["SOC Delta Layer", "PVI Layer"] },
  { id: "r7", title: "Digital Registration & Title Integrity: Evidence from Indian States", year: 2024, source: "Demo Repository · e-Governance Studies", state: "MH", topic: "Land Records", type: "Government Report", location: "Multi-state", summary: "Sub-24h deed-to-RoR synchronization correlates with sharp falls in duplicate-registration attempts. Encumbrance automation converts hidden liens into pre-registration alerts.", datasets: ["NGDRS Registered Deeds Extract (demo)", "Mutation Latency Audit Log (demo)"], layers: ["Registered Deeds Density Layer", "Mutation Latency Heatmap"] },
  { id: "r8", title: "Fiscal Frictions in Land Markets: Stamp Duty Elasticities", year: 2024, source: "Demo Repository · Public Finance Review", state: "KA", topic: "Policy Simulation", type: "Journal Paper", location: "Multi-state", summary: "Registration-volume elasticity to stamp duty is about -1.5 in the 3–7% band. Duty cuts produce a revenue J-curve crossing baseline by year 5–7 and a measurable formalization dividend.", datasets: ["NGDRS Transaction Volume Panel (demo)"], layers: ["Transaction Volume Layer"] },
  { id: "r9", title: "Western Ghats Eco-Sensitive Zone Transitions", year: 2022, source: "Demo Repository · Environmental Policy Notes", state: "KA", topic: "Climate Risk", type: "Policy Brief", location: "Mysuru, Karnataka", summary: "Afforestation interventions in degraded buffers improved water retention indices within four monsoon cycles in simulation; eco-zone designation reduced conversion pressure adjacent to forest cover.", datasets: ["LULC Change Detection (demo)"], layers: ["Forest Cover Layer", "Water Bodies Layer"] },
  { id: "r10", title: "SVAMITVA Drone Cadastre: Accuracy Audit of Urban Fringe Surveys", year: 2025, source: "Demo Repository · Geospatial Standards Bulletin", state: "GJ", topic: "Land Records", type: "Government Report", location: "Surat, Gujarat", summary: "Drone-ortho cadastral maps matched ground-truth within 0.4% area error across demo batches; residual mismatches cluster in parcels with unrecorded encroachments — a dispute leading indicator.", datasets: ["Resurvey Mismatch Register (demo)"], layers: ["Resurvey Mismatch Layer"] },
  { id: "r11", title: "Canal Command and Cropping Intensification: Narmada Fringe Study", year: 2023, source: "Demo Repository · Water Economics Papers", state: "MP", topic: "Agriculture", type: "Case Study", location: "Phanda, Madhya Pradesh", summary: "Parcels within 500 m of canal distributaries show 1.4x cropping intensity but faster groundwater drawdown in the command tail — motivating conjunctive-use scheduling in PVI weighting.", datasets: ["CGWB Groundwater Series (demo)", "Cropping Intensity Panel (demo)"], layers: ["Water Bodies Layer", "Groundwater Decline Layer"] },
  { id: "r12", title: "Predicting Revenue-Court Litigation Surges: A Survival Analysis", year: 2025, source: "Demo Repository · Computational Law Review", state: "TG", topic: "Disputes", type: "Journal Paper", location: "Multi-state", summary: "Gradient-boosted survival models over RCCMS lifecycles reach demo AUC of about 0.82 for 12-month dispute onset using boundary mismatch, fragmentation depth and inheritance-lag features.", datasets: ["RCCMS Case Lifecycle Extract (demo)"], layers: ["Litigation-Surge Heatmap"] },
];

const STATE_POLICY_NOTES = {
  MH: "Pune & Raigad fringe: corridor-driven conversion pressure highest among demo states. Active land-pooling pilots on the ring-road belt; circle-rate revision cycles under review.",
  KA: "Bengaluru Rural: northern-corridor speculation guardrails proposed after 3.1x velocity spike. Western Ghats ESZ transitions constrain western-district conversions.",
  GJ: "Dholera SIR: land-banking controls and automated circle-rate triggers recommended by the demo speculation study. Solar-park conversions expanding in the arid belt.",
  TG: "Warangal: Dharani-linked auto-mutation camps reduced simulated new filings 22%. Groundwater notified-zone rules gate conversions in Hanamkonda.",
  MP: "Bhopal fringe: Narmada command-area water scheduling under pilot; canal-adjacent intensification balanced against drawdown warnings.",
};

/* Scenario A/B presets for Policy Lab comparison */
const SCENARIO_PRESETS = {
  A: { label: "Scenario A — Industrial Development", region: "MH", change: "agri-industrial", area: 500, policy: "conversion", horizon: 5 },
  B: { label: "Scenario B — Agricultural Protection", region: "MH", change: "agri-protect", area: 500, policy: "lease", horizon: 5 },
};

/* Extra AI intents (merged with RAG_TOPICS at runtime) */
const RAG_EXTRA = [
  {
    id: "mh-landuse",
    keywords: ["maharashtra", "land-use change", "land use change", "major land-use", "major land use"],
    question: "What are the major land-use changes in Maharashtra?",
    answer:
      "In the demo corpus, Maharashtra's agricultural cover fell from 54.2% (2015) to 49.8% (2025) while urban cover rose from 7.1% to 10.4% — the sharpest transition among the five demo states. Conversion concentrates in three belts: the Pune Haveli–Mulshi fringe, the Mumbai–Pune expressway corridor through Khalapur, and the Nashik–Shirdi highway. Forest cover edged up (16.4% to 16.8%) under Western Ghats afforestation programs, and barren/wasteland share grew 1.3 pts, largely in drought-exposed eastern taluks.",
    insights: [
      "Urban share +3.3 pts in a decade, overwhelmingly on converted agricultural land.",
      "Corridor notification is the leading indicator — conversion follows within 2–4 years.",
      "Wasteland growth in water-stressed taluks suggests degradation, not idle supply.",
    ],
    datasets: ["LULC Change Detection 2015–2025 (demo)", "Conversion Application Register (demo)"],
    research: ["Peri-Urban Transformation of the Pune Metropolitan Fringe (demo, 2024)"],
    policy: ["DILRMP 3.0 Guidelines — Urban-Rural Boundary Monitoring (illustrative)"],
    layers: ["Urban Expansion Layer", "Land Use Layer"],
    next: ["Select Maharashtra on the National Dashboard land-use chart", "Open GIS Explorer, then Pune, then Haveli with the Urban Growth layer on"],
  },
  {
    id: "climate-areas",
    keywords: ["higher climate risk", "climate risk", "which areas", "drought risk", "risk areas"],
    question: "Which areas have higher climate risk?",
    answer:
      "Across the demo states, the highest composite climate risk (drought + heat + water stress) appears in Gujarat's arid belt (composite about 76), followed by Maharashtra (about 68) and Madhya Pradesh (about 66). At region level, the most exposed demo units are Sangamner and Shrirampur (Ahmednagar, MH) with water-stress indices in the high band, Dholka–Sanand (GJ) under combined heat and drought load, and the Warangal notified-groundwater zones (TG). Telangana's irrigated tracts and Karnataka's Western Ghats fringe show materially lower exposure.",
    insights: [
      "Water stress, not flood risk, dominates the composite in four of five demo states.",
      "Risk clusters align with the dispute radar's tenancy-conflict hotspots.",
      "SHC re-issue deltas lead groundwater inflection by 2–3 seasons — an early-warning channel.",
    ],
    datasets: ["Parcel Vulnerability Index v1 (demo)", "CGWB Groundwater Series (demo)"],
    research: ["Climate-Land Nexus: Parcel-Level Vulnerability in Semi-Arid India (demo, 2025)"],
    policy: ["ISRO Bhuvan Hazard Overlay Specifications (illustrative)"],
    layers: ["Climate Risk Composite", "Groundwater Decline Layer", "PVI Layer"],
    next: ["Enable the Climate Risk layer on GIS Explorer", "Open the climate-vs-soil quick query for the correlation evidence"],
  },
  {
    id: "compare-states",
    keywords: ["compare maharashtra", "compare", "comparison", "karnataka"],
    question: "Compare Maharashtra and Karnataka.",
    answer:
      "Maharashtra urbanizes faster (urban expansion +18.4% vs +14.2% over the demo decade) and carries higher dispute density (6.8 vs 5.4 per 1,000 parcels), driven by the Pune and Mumbai-Pune corridors. Karnataka holds more agricultural (55.6% vs 49.8%) and forest cover (20.1% vs 16.8%), with climate risk moderated by the Western Ghats belt but drought exposure still elevated in the north. Infrastructure indexing favors Maharashtra (74 vs 69), and research output share is higher (21% vs 17% of the demo corpus). Policy-wise, Maharashtra needs conversion-pressure guardrails; Karnataka needs drought-adaptation support for its northern taluks.",
    insights: [
      "MH: growth-and-dispute profile; KA: agrarian-and-drought profile.",
      "Dispute density tracks corridor proximity more than state-level urbanization rate.",
      "Forest-cover advantage gives KA a stronger eco-services base for afforestation scenarios.",
    ],
    datasets: ["State Indicator Panel (demo)", "LULC Change Detection (demo)"],
    research: ["Peri-Urban Transformation of the Pune Fringe (demo, 2024)", "Western Ghats ESZ Transitions (demo, 2022)"],
    policy: ["DILRMP 3.0 Guidelines (illustrative)"],
    layers: ["All state-level layers on the National Map"],
    next: ["Use Compare MH vs KA on the National Dashboard", "Run Scenario A/B with region switched to Karnataka in Policy Lab"],
  },
  {
    id: "agri-industrial",
    keywords: ["converted to industrial", "industrial use", "industrial zone", "conversion to industrial", "policy", "simulation", "happen if"],
    question: "What could happen if agricultural land is converted to industrial use?",
    answer:
      "Simulated conversions in the demo Policy Lab show a consistent pattern for a 500 ha agricultural-to-industrial conversion over 5–10 years: direct loss of about 500 ha productive agri cover and 900–1,200 affected households, against creation of 3,500–4,800 jobs and ₹2,500–3,200 Cr infrastructure investment with a 2.5–3.8x GVA multiplier by horizon end. Water balance shifts −12% to −18% (extraction plus impervious-surface runoff loss) and local climate risk rises 2–8 points (heat-island effect). Projected new land disputes scale with affected households (about 6% filing rate) unless pooling-based instruments are used — land pooling cuts dispute projections roughly 18% versus direct conversion.",
    insights: [
      "Jobs and GVA gains are real but geographically concentrated; displacement costs diffuse.",
      "Water and climate deltas are the least-reversible impacts — front-load mitigation.",
      "Instrument choice matters: pooling/lease models measurably reduce dispute incidence vs acquisition.",
    ],
    datasets: ["Sandbox Simulation Registry (demo)", "Household Affected Panel (demo)"],
    research: ["Dholera SIR Land Banking: Speculation Metrics (demo, 2024)", "Bengaluru Northern Corridor Spillover (demo, 2023)"],
    policy: ["State CLU Conversion Rules (illustrative)", "DILRMP 3.0 Guidelines — Land-Use Planning"],
    layers: ["Conversion Pressure Layer", "Water Bodies Layer", "Infrastructure Layer"],
    next: ["Open Policy Lab and run the 500 ha scenario", "Use Compare Scenarios to see Industrial vs Agricultural Protection side-by-side"],
  },
];

/* Merge extra intents into the RAG topic list */
RAG_TOPICS.push(...RAG_EXTRA);
