/* BhumiMitra — demo domain datasets (clearly simulated, not official statistics). */
"use strict";

const DEMO_LABEL = "Demo Platform Data — simulated for demonstration; not official Government of India statistics.";

/* ---------------- Parcel registry (Tab 1) ---------------- */
const PARCELS = [
  {
    code: "MH-PUN-0291-8841",
    ulpin: "27PUNEHV02918841",
    surveyNo: "142/3A",
    village: "Wagholi", taluk: "Haveli", district: "Pune", state: "Maharashtra",
    center: [18.5108, 73.9902],
    polygon: [[18.5122,73.9880],[18.5126,73.9921],[18.5098,73.9929],[18.5090,73.9887]],
    status: "disputed",
    statusBadge: "Active Dispute Caveat",
    areaHa: 2.45,
    owner: "S. Kulkarni (holder) + 3 co-sharers",
    soilIndex: 7.4, soilNote: "Organic Carbon",
    climateScore: 42.0, climateNote: "Moderate Stress",
    zoning: "Semi-Urban Agricultural · Peri-urban expansion zone",
    biography:
      "First cadastrally surveyed in 1972 and partitioned through a 2018 mutation shared by four co-sharers, this 2.45 Ha Demo Parcel at Wagholi sits directly in the Pune–Nagar corridor's infrastructure impact zone. Road-widening acquisition notifications since 2021 have raised its circle-rate delta 38% above the taluk median, intensifying conversion pressure. A 2023 revenue-court injunction over an unregistered co-sharer transfer places it in the Active Dispute Caveat class with elevated litigation-surge probability.",
    timeline: [
      { year: "1972", tag: "Cadastral Survey", title: "Original Cadastral Survey", text: "Parcel 142/3A first recorded in the village cadastral map; 2.45 Ha agricultural classification.", details: "Survey chain: settlement-era record → 1972 Haveli taluka re-tabulation → digitized under Bhoomi/eBhumi in 2009. Demo geometry matched to the 1972 sketch within 0.6% area error." },
      { year: "2018", tag: "NGDRS", title: "Mutation & Partition", text: "Family partition registered; mutation to current holder with three co-sharers and a bank mortgage.", details: "Partition deed split survey 142 into 142/3A (2.45 Ha) and 142/3B (1.10 Ha). One co-sharer's share transfer remained unregistered — the root flag behind the 2023 injunction." },
      { year: "2021", tag: "Infrastructure", title: "Infrastructure Impact & ULPIN", text: "Pune–Nagar corridor widening notification raises acquisition risk; 14-digit Bhu-Aadhaar (ULPIN) assigned.", details: "Corridor notification covers a 40 m band overlapping the parcel's northern 0.3 Ha. ULPIN generation batch MH-2021; drone orthoimagery from the NAKSHA cycle is the geometry baseline." },
      { year: "2023", tag: "Climate", title: "Land / Climate Update", text: "Soil Health Card re-issue and PVI refresh record moderate climate stress (42.0) with SOC at 7.4/10.", details: "PVI drivers: pre-monsoon water-table decline (−1.8 m vs 2015) and NDVI volatility 2019–2023. SHC advisory recommends micro-irrigation and a pulse intercrop." },
      { year: "2023", tag: "RCCMS", title: "Revenue Court Injunction", text: "Injunction on transfer pending resolution of the unregistered co-sharer share claim.", details: "RCCMS case class: partition/possession. Survival-model estimate: 14 months to disposal. Parcel twin state moved to Disputed; flagged on the Dispute Radar as a Haveli cluster member." },
    ],
  },
  {
    code: "TG-WRG-1102-3950",
    ulpin: "36WRGLL11023950",
    surveyNo: "1102/2",
    village: "Dharmasagar", taluk: "Hanamkonda", district: "Warangal", state: "Telangana",
    center: [17.9993, 79.5782],
    polygon: [[18.0007,79.5764],[18.0011,79.5799],[17.9981,79.5806],[17.9976,79.5770]],
    status: "clean",
    statusBadge: "Clean Title",
    areaHa: 3.10,
    owner: "P. Reddy (sole pattadar)",
    soilIndex: 6.8, soilNote: "Organic Carbon",
    climateScore: 55.5, climateNote: "Elevated Water Stress",
    zoning: "Agricultural (Paddy–Cotton belt) · Groundwater notified zone",
    biography:
      "A 3.10 Ha paddy–cotton holding under a sole pattadar with an unbroken title chain since its 1972 settlement entry and a clean 2005 mutation. Soil organic carbon sits at a moderate 6.8/10, but the parcel lies in a notified groundwater zone with a climate-vulnerability score of 55.5 driven by declining pre-monsoon water tables. No encumbrances, litigation flags or boundary mismatches appear on record after the 2021 ULPIN generation.",
    timeline: [
      { year: "1972", tag: "RoR", title: "Settlement Entry", text: "Pattadar rights recorded during Telangana settlement operations; 3.10 Ha irrigated." },
      { year: "1988", tag: "Consolidation", title: "Holding Consolidation", text: "Two fragmented survey entries consolidated into a single contiguous parcel 1102/2." },
      { year: "2005", tag: "Mutation", title: "Succession Mutation", text: "Clean inheritance mutation to current holder; all legal-heir NOCs registered." },
      { year: "2021", tag: "ULPIN", title: "Bhu-Aadhaar Generation", text: "14-digit ULPIN assigned; geometry validated against Dharani cadastral layer." },
      { year: "2024", tag: "SHC", title: "Soil Health Card Re-issue", text: "SOC 6.8/10; micronutrient advisory issued, groundwater-stress flag raised." },
    ],
  },
  {
    code: "MH-MUL-0442-1207",
    ulpin: "27PUNEMU04421207",
    surveyNo: "442/1B",
    village: "Lavale", taluk: "Mulshi", district: "Pune", state: "Maharashtra",
    center: [18.4921, 73.7312],
    polygon: [[18.4934,73.7296],[18.4938,73.7328],[18.4912,73.7335],[18.4906,73.7301]],
    status: "watch",
    statusBadge: "Watch — Encumbrance Query",
    areaHa: 1.85,
    owner: "A. Pawar + 1 co-sharer",
    soilIndex: 8.1, soilNote: "Organic Carbon",
    climateScore: 31.0, climateNote: "Low Stress (Western Ghats belt)",
    zoning: "Agricultural · IT-corridor influence zone (Hinjawadi adjacency)",
    biography:
      "An 1.85 Ha parcel in Mulshi's rapidly appreciating Hinjawadi influence belt, held by two co-sharers under a clean 2016 mutation. A pending encumbrance-certificate query from a 2022 private sale agreement places the twin in Watch state, though no court filing exists. Conversion pressure from adjacent IT-corridor expansion makes this parcel a high-probability land-use-change candidate within five years.",
    timeline: [
      { year: "1979", tag: "RoR", title: "Original Allotment", text: "Agricultural grant recorded; Western Ghats foothill classification." },
      { year: "2016", tag: "Mutation", title: "Family Partition Mutation", text: "Parcel subdivided 442/1A–1B; current holder assigned 1.85 Ha share." },
      { year: "2021", tag: "ULPIN", title: "Bhu-Aadhaar Generation", text: "14-digit ULPIN assigned under SVAMITVA drone-survey batch MH-2021." },
      { year: "2022", tag: "Watch", title: "Encumbrance Query", text: "Unregistered sale agreement surfaced during EC refresh; twin state moved to Watch." },
    ],
  },
  {
    code: "MP-BHO-0777-3312",
    ulpin: "23BHOPN07773312",
    surveyNo: "777/3",
    village: "Neemachha", taluk: "Phanda", district: "Bhopal", state: "Madhya Pradesh",
    center: [23.3644, 77.2673],
    polygon: [[23.3658,77.2657],[23.3661,77.2690],[23.3634,77.2696],[23.3630,77.2662]],
    status: "clean",
    statusBadge: "Clean Title",
    areaHa: 4.02,
    owner: "R. Yadav (sole holder)",
    soilIndex: 6.2, soilNote: "Organic Carbon",
    climateScore: 48.0, climateNote: "Moderate Heat Stress",
    zoning: "Agricultural (Wheat–Soybean) · Narmada canal command fringe",
    biography:
      "A 4.02 Ha wheat–soybean holding on Bhopal's peri-urban fringe with clean title since the 1985 consolidation of three ancestral fragments. Moderate heat stress (48.0) and declining soil organic carbon (6.2/10) are the twin's principal health flags, with SHC advisories recommending crop diversification. No litigation, mortgage or conversion applications are on record as of the 2025 EC refresh.",
    timeline: [
      { year: "1985", tag: "Consolidation", title: "Fragment Consolidation", text: "Three ancestral holdings consolidated into contiguous parcel 777/3 under MP consolidation act." },
      { year: "2009", tag: "Bhoomi", title: "Digitization (Bhoomi/MP-eBhumi)", text: "Record of Rights computerized; Khasra map geo-referenced." },
      { year: "2021", tag: "ULPIN", title: "Bhu-Aadhaar Generation", text: "14-digit ULPIN assigned; geometry matched to cadastral layer within 0.4%." },
      { year: "2025", tag: "SHC", title: "Soil Health Card Advisory", text: "SOC decline flagged; diversification advisory issued under climate-resilience scheme." },
    ],
  },
];

/* ---------------- National dashboard (Tab 0) ---------------- */
const PLATFORM_METRICS = [
  { label: "Research Resources", value: "12,480" },
  { label: "Datasets", value: "3,265" },
  { label: "GIS Layers", value: "418" },
  { label: "Policy Simulations", value: "1,077" },
  { label: "Research Institutions", value: "186" },
  { label: "Active Projects", value: "94" },
];

/* Schematic demo boundaries — NOT official Survey of India geometry. */
const STATES = {
  MH: {
    name: "Maharashtra", center: [19.3, 76.8], zoom: 7,
    polygon: [[20.9,72.6],[21.9,75.0],[22.5,78.5],[21.5,80.5],[20.3,80.0],[19.5,78.5],[18.8,77.0],[17.8,76.0],[16.2,75.5],[15.8,74.3],[17.0,73.2],[18.6,72.6],[19.8,72.7],[20.9,72.6]],
    landUse: {
      years: [2015, 2020, 2025],
      agri:    [54.2, 52.1, 49.8], forest: [16.4, 16.6, 16.8],
      urban:   [7.1, 8.6, 10.4], water:  [4.8, 4.5, 4.2], barren: [17.5, 18.2, 18.8],
    },
    climate: { flood: 58, drought: 71, landslide: 22, heat: 64, waterStress: 69 },
    urbanExpansion: 18.4, disputeDensity: 6.8, infraIndex: 74, researchShare: 21,
  },
  KA: {
    name: "Karnataka", center: [14.8, 76.2], zoom: 7,
    polygon: [[17.9,76.0],[18.8,77.0],[18.2,78.4],[17.2,78.6],[16.3,78.0],[15.8,77.0],[14.8,76.2],[14.0,75.0],[13.0,74.6],[12.4,75.0],[11.6,76.0],[12.0,77.6],[13.2,78.5],[14.6,78.0],[15.5,77.5],[16.5,76.5],[17.9,76.0]],
    landUse: {
      years: [2015, 2020, 2025],
      agri:    [58.9, 57.4, 55.6], forest: [19.8, 20.0, 20.1],
      urban:   [5.4, 6.3, 7.5], water:  [3.9, 3.7, 3.5], barren: [12.0, 12.6, 13.3],
    },
    climate: { flood: 41, drought: 63, landslide: 30, heat: 57, waterStress: 61 },
    urbanExpansion: 14.2, disputeDensity: 5.4, infraIndex: 69, researchShare: 17,
  },
  GJ: {
    name: "Gujarat", center: [22.8, 71.5], zoom: 7,
    polygon: [[24.7,68.8],[24.0,69.8],[23.0,70.0],[22.5,69.2],[21.6,69.5],[20.7,72.0],[21.5,72.8],[22.0,73.4],[23.0,74.0],[24.0,73.5],[24.6,73.0],[24.7,68.8]],
    landUse: {
      years: [2015, 2020, 2025],
      agri:    [48.7, 47.2, 45.5], forest: [9.6, 9.8, 10.0],
      urban:   [9.2, 10.4, 11.8], water:  [3.4, 3.2, 3.0], barren: [29.1, 29.4, 29.7],
    },
    climate: { flood: 47, drought: 74, landslide: 8, heat: 78, waterStress: 76 },
    urbanExpansion: 21.6, disputeDensity: 4.9, infraIndex: 78, researchShare: 14,
  },
  TG: {
    name: "Telangana", center: [17.9, 79.4], zoom: 7,
    polygon: [[19.6,77.4],[19.9,78.6],[19.0,79.9],[18.8,81.3],[17.8,81.5],[17.0,80.6],[16.2,79.2],[16.4,78.0],[17.3,77.5],[18.2,77.6],[19.6,77.4]],
    landUse: {
      years: [2015, 2020, 2025],
      agri:    [43.8, 44.6, 45.1], forest: [20.1, 20.8, 21.3],
      urban:   [5.9, 6.8, 7.9], water:  [5.1, 5.4, 5.7], barren: [25.1, 22.4, 20.0],
    },
    climate: { flood: 38, drought: 58, landslide: 12, heat: 72, waterStress: 54 },
    urbanExpansion: 16.8, disputeDensity: 5.9, infraIndex: 66, researchShare: 12,
  },
  MP: {
    name: "Madhya Pradesh", center: [23.8, 77.8], zoom: 6,
    polygon: [[26.9,77.5],[26.8,79.5],[25.9,80.5],[24.9,81.4],[23.9,82.6],[22.6,81.7],[21.9,80.0],[21.6,78.0],[21.4,76.0],[22.1,75.2],[22.6,74.2],[23.6,74.0],[24.7,74.6],[26.9,77.5]],
    landUse: {
      years: [2015, 2020, 2025],
      agri:    [47.3, 46.5, 45.4], forest: [24.8, 25.0, 25.2],
      urban:   [4.6, 5.2, 6.0], water:  [3.2, 3.1, 3.0], barren: [20.1, 20.2, 20.4],
    },
    climate: { flood: 44, drought: 66, landslide: 10, heat: 70, waterStress: 63 },
    urbanExpansion: 12.7, disputeDensity: 7.2, infraIndex: 58, researchShare: 10,
  },
};

const COMPARE_REGIONS = {
  MH: { urban: "+18.4% (2015–25)", agri: "49.8% cover", forest: "16.8%", climateRisk: "High (drought 71)", infra: "74/100", disputes: "6.8 / 1k parcels" },
  KA: { urban: "+14.2% (2015–25)", agri: "55.6% cover", forest: "20.1%", climateRisk: "Moderate-High (drought 63)", infra: "69/100", disputes: "5.4 / 1k parcels" },
};

const LAYER_DEFS = {
  landuse:   { label: "Land Use (Agri %)", key: (s) => s.landUse.agri[2], buckets: [50, 46], colors: ["#2d6a4f", "#74a892", "#b07d3b"], legend: ["Agri ≥ 50%", "46–50%", "< 46%"] },
  climate:   { label: "Climate Risk Composite", key: (s) => (s.climate.drought + s.climate.heat + s.climate.waterStress) / 3, buckets: [70, 62], colors: ["#dc2626", "#e08a3c", "#74a892"], legend: ["High ≥ 70", "Moderate 62–70", "Lower < 62"], invert: true },
  urban:     { label: "Urban Expansion (10-yr %)", key: (s) => s.urbanExpansion, buckets: [18, 15], colors: ["#1a1a2e", "#5b5b8a", "#a3a3c2"], legend: ["Rapid ≥ 18%", "High 15–18%", "Moderate < 15%"] },
  disputes:  { label: "Dispute Density (per 1k parcels)", key: (s) => s.disputeDensity, buckets: [6.5, 5.5], colors: ["#dc2626", "#e08a3c", "#74a892"], legend: ["High ≥ 6.5", "Moderate 5.5–6.5", "Lower < 5.5"] },
  infra:     { label: "Infrastructure Index", key: (s) => s.infraIndex, buckets: [70, 63], colors: ["#2d6a4f", "#74a892", "#b07d3b"], legend: ["Strong ≥ 70", "Developing 63–70", "Gap < 63"] },
};

/* ---------------- Dispute Early Warning Radar (Tab 3) ---------------- */
const TALUK_RISK = [
  { taluk: "Haveli", district: "Pune, MH", risk: "high", parcels: 184320, pending: 4127, pendency: "41 months", driver: "Peri-urban conversion + unregistered co-sharer transfers", intervention: "Monthly mediation camps; freeze-circle-rate review; priority resurvey under NAKSHA" },
  { taluk: "Mulshi", district: "Pune, MH", risk: "medium", parcels: 96410, pending: 1583, pendency: "28 months", driver: "IT-corridor land pooling & sale-agreement disputes", intervention: "Encumbrance-certificate refresh drive; land-pooling grievance cell" },
  { taluk: "Dharmasagar", district: "Warangal, TG", risk: "high", parcels: 74230, pending: 2311, pendency: "47 months", driver: "Unmutated inheritance backlog after 2019–21 successions", intervention: "Inheritance auto-mutation camp (Dharani linkage); legal-aid clinic" },
  { taluk: "Hanamkonda", district: "Warangal, TG", risk: "medium", parcels: 118900, pending: 1902, pendency: "24 months", driver: "Groundwater-zone conversion applications", intervention: "Pre-clearance advisory; conversion-rule awareness drive" },
  { taluk: "Khalapur", district: "Raigad, MH", risk: "high", parcels: 88150, pending: 2866, pendency: "39 months", driver: "Mumbai–Pune corridor acquisition & boundary mismatches", intervention: "Boundary resurvey sprint; corridor-affected parcel twin audit" },
  { taluk: "Sangamner", district: "Ahmednagar, MH", risk: "low", parcels: 102770, pending: 844, pendency: "14 months", driver: "Fragmented dryland holdings (controlled)", intervention: "Standard monitoring; voluntary consolidation incentives" },
  { taluk: "Phanda", district: "Bhopal, MP", risk: "low", parcels: 93540, pending: 1021, pendency: "16 months", driver: "Canal-command water-sharing queries (controlled)", intervention: "Standard monitoring; seasonal water-rights counselling" },
];

/* ---------------- Geo-GraphRAG (Tab 4) ---------------- */
const RAG_TOPICS = [
  {
    id: "ngdrs-fraud",
    keywords: ["fraud", "ngdr", "e-registration", "registration", "fraud reduction"],
    question: "How does NGDRS e-registration reduce land-record fraud?",
    answer:
      "NGDRS-standardized e-registration reduces fraud through three mechanisms verified across state implementations: (1) biometric-linked deed execution removes impersonation in sale and mortgage registration; (2) automated encumbrance-certificate generation surfaces prior liens and pending injunctions at the moment of registration rather than years later; (3) same-day RoR–deed synchronization closes the classic mutation lag exploited by duplicate-sale fraud. Evidence from pilot states shows duplicate-registration attempts falling sharply where deed-to-RoR sync latency dropped below 24 hours.",
    insights: [
      "Fraud exposure concentrates in the mutation lag window between registration and RoR update; sub-24h sync is the decisive control.",
      "Encumbrance-certificate automation converts hidden liens into pre-registration alerts.",
      "Biometric execution blocks impersonation but not benami structuring — those require beneficial-ownership analysis.",
    ],
    datasets: ["NGDRS Registered Deeds Extract (demo)", "Encumbrance Certificate Series (demo)", "Mutation Latency Audit Log (demo)"],
    research: ["Digital Registration & Title Integrity: Evidence from Indian States (demo repository entry, 2024)", "Benami Detection via Transaction Graph Anomalies (demo, 2025)"],
    policy: ["DILRMP 3.0 Guidelines — Conclusive Titling & NGDRS Integration Chapter", "DoLR RCCMS Bulletin 12/2025 (illustrative citation)"],
    layers: ["Registered Deeds Density Layer", "Mutation Latency Heatmap"],
    next: ["Run the Dispute Radar filter on high-latency taluks", "Simulate EC-refresh mandates in the Policy Lab"],
  },
  {
    id: "climate-soil",
    keywords: ["climate", "soil", "vulnerability", "correlation", "drought"],
    question: "What is the correlation between climate vulnerability and soil health?",
    answer:
      "Across the demo parcel corpus, climate-vulnerability scores correlate negatively with soil organic carbon (indicative r ≈ −0.61 in the simulated panel): parcels in high water-stress belts show 12–18% lower SOC and steeper degradation slopes over 2015–2025. The relationship is mediated by cropping intensity — water-stressed parcels shift toward extractive monocultures that deplete organic matter, which in turn reduces infiltration and amplifies drought exposure, forming a degradation feedback loop. Soil Health Card re-issue deltas provide the earliest leading indicator, typically preceding water-table inflection by 2–3 seasons.",
    insights: [
      "SOC decline is a leading indicator of groundwater stress, not merely a consequence.",
      "The feedback loop (stress → monoculture → SOC loss → worse infiltration) is strongest in semi-arid taluks.",
      "SHC re-issue cadence materially improves PVI refresh quality.",
    ],
    datasets: ["Soil Health Card Panel 2015–2025 (demo)", "CGWB Groundwater Level Series (demo)", "Parcel Vulnerability Index v1 (demo)"],
    research: ["Climate-Land Nexus: Parcel-Level Vulnerability in Semi-Arid India (demo, 2025)", "Soil Carbon Dynamics under Water Stress (demo, 2023)"],
    policy: ["DILRMP 3.0 Guidelines — Climate Resilience & Land-Use Planning", "ISRO Bhuvan Hazard Overlay Specifications (illustrative)"],
    layers: ["Parcel Vulnerability Index (PVI) Layer", "Groundwater Decline Layer", "SOC Delta Layer"],
    next: ["Overlay PVI with the Dispute Radar — water stress predicts tenancy conflicts", "Run a drought-shock scenario in the Policy Lab"],
  },
  {
    id: "periurban",
    keywords: ["peri-urban", "urban expansion", "conversion", "maharashtra", "pune"],
    question: "What are the major peri-urban land-use changes in Maharashtra?",
    answer:
      "Simulated change-detection on the demo corpus shows Maharashtra's urban cover rising from 7.1% (2015) to 10.4% (2025), with conversion concentrated in three corridors: Pune's Haveli–Mulshi fringe (IT-corridor adjacency), the Mumbai–Pune expressway belt through Khalapur, and Nashik–Shirdi highway parcels. Agricultural-to-non-agricultural conversion applications in Haveli tripled over the decade, and parcels within 2 km of notified infrastructure carry a circle-rate delta 30–40% above taluk medians — the signature that precedes speculative churn and, with a 2–3 year lag, dispute density spikes.",
    insights: [
      "Infrastructure notification is the strongest single predictor of conversion pressure.",
      "Speculative buying precedes litigation surges by 2–3 years — an exploitable early-warning window.",
      "Fragmentation rises with conversion as holdings are subdivided for plotted development.",
    ],
    datasets: ["LULC Change Detection 2015–2025 (demo)", "Circle-Rate Delta Series (demo)", "Conversion Application Register (demo)"],
    research: ["Peri-Urban Transformation of the Pune Metropolitan Fringe (demo, 2024)", "Infrastructure Shocks and Land Speculation (demo, 2025)"],
    policy: ["NAKSHA Urban Survey Framework", "DILRMP 3.0 Guidelines — Urban-Rural Boundary Monitoring"],
    layers: ["Urban Expansion Layer", "Conversion Pressure Layer", "Circle-Rate Delta Layer"],
    next: ["Open the Digital Twin for parcel MH-PUN-0291-8841 in Haveli", "Enable the Urban Expansion layer on the National Map"],
  },
  {
    id: "stamp-duty",
    keywords: ["stamp duty", "stamp", "duty", "registration rate", "transaction volume"],
    question: "How do stamp-duty changes affect land transaction volume and informality?",
    answer:
      "Elasticity estimates from the demo simulator, calibrated on published state-level natural experiments, put registration-volume elasticity to stamp-duty rates at roughly −1.5 over the 3–7% band: a 1.5-point cut raises formal transaction volume by about 20–25% within four years. The formalization dividend is the dominant second-order effect — unregistered and benami transfers fall as the cost of legality drops below the cost of informality. Revenue shows a J-curve: an initial 1–2 year dip, then recovery through volume growth, typically crossing baseline by year 5–7 depending on speculative absorption capacity.",
    insights: [
      "Volume elasticity ≈ −1.5 in the 3–7% duty band (simulated calibration).",
      "Informality falls monotonically with duty rates; cuts pay a formalization dividend.",
      "The revenue J-curve crossing point is district-specific — corridor districts recover fastest.",
    ],
    datasets: ["NGDRS Transaction Volume Panel (demo)", "Circle vs Market Rate Wedge Series (demo)"],
    research: ["Fiscal Frictions in Land Markets: Stamp Duty Elasticities (demo, 2024)", "Informality and Formalization Dividends (demo, 2025)"],
    policy: ["State Stamp Acts — comparative compendium (illustrative)", "DILRMP 3.0 Guidelines — Revenue Modernization"],
    layers: ["Transaction Volume Layer", "Market-Wedge Layer"],
    next: ["Test a duty cut in the Policy Counterfactual Simulator", "Pair with ceiling adjustments to check fragmentation side-effects"],
  },
  {
    id: "ulpin",
    keywords: ["ulpin", "bhu-aadhaar", "join key", "interoperab", "land stack"],
    question: "How does ULPIN function as the universal join key across land databases?",
    answer:
      "The 14-digit Bhu-Aadhaar (ULPIN) encodes the administrative hierarchy and geohash of each parcel, making it a deterministic spatial foreign key across previously unjoinable domains: RoR and mutation registers, NGDRS deeds, RCCMS case records, AgriStack crop layers, Soil Health Cards, CGWB water data and master-plan zoning. Where legacy records predate ULPIN assignment, a spatial-join fallback (parcel-geometry intersection with confidence scoring) bridges the gap, and every joined edge carries a temporal validity window — producing a bitemporal national panel in which any attribute of any parcel can be queried as-of a date.",
    insights: [
      "Deterministic ULPIN joins where assigned; geometry fallback with confidence scores elsewhere.",
      "Temporal validity windows on edges make as-of-date queries possible (bitemporal graph).",
      "Cross-source date disagreements are themselves dispute signals, not just data errors.",
    ],
    datasets: ["ULPIN Assignment Register (demo extract)", "Legacy Spatial-Join Confidence Table (demo)"],
    research: ["Bitemporal Land Knowledge Graphs for Policy Analytics (demo, 2025)", "Record Linkage Quality in Cadastral Systems (demo, 2024)"],
    policy: ["Bharat Land Stack — Interoperability Specifications", "DILRMP 3.0 Guidelines — Bhu-Aadhaar Universalization"],
    layers: ["ULPIN Coverage Layer", "Join-Confidence Layer"],
    next: ["Open a Parcel Biography to see the join in action", "Review join-confidence distribution for a target district"],
  },
  {
    id: "disputes",
    keywords: ["dispute", "litigation", "court", "rccms", "pendency", "inheritance"],
    question: "What drives land-dispute pendency and how can it be predicted?",
    answer:
      "Survival analysis over the simulated RCCMS panel identifies four dominant pendency drivers: unregistered inheritance (death-to-mutation lag), boundary mismatches between cadastral maps and resurvey geometry, fragmentation depth across generations of subdivision, and title-type ambiguity between ancestral and self-acquired classifications. Combined, these features support a 12-month dispute-onset prediction with AUC ≈ 0.82 in demo calibration. Pendency is strongly taluk-clustered — the top three taluks account for a disproportionate share of case-years — which makes preventive mediation camps a high-leverage, low-cost intervention.",
    insights: [
      "Four structural drivers explain most pendency variance; inheritance lag is the largest single contributor.",
      "Dispute onset is predictable 6–12 months ahead at taluk granularity (demo AUC ≈ 0.82).",
      "Clustering means preventive mediation scales efficiently — camps, not case-by-case triage.",
    ],
    datasets: ["RCCMS Case Lifecycle Extract (demo)", "Resurvey Mismatch Register (demo)", "Death-Mutation Lag Panel (demo)"],
    research: ["Predicting Revenue-Court Litigation Surges (demo, 2025)", "Inheritance Informality and Title Disputes (demo, 2024)"],
    policy: ["DoLR RCCMS Bulletins (illustrative)", "DILRMP 3.0 Guidelines — Dispute Prevention"],
    layers: ["Litigation-Surge Heatmap", "Resurvey Mismatch Layer"],
    next: ["Open the Dispute Early Warning Radar", "Filter high-flashpoint taluks and export the intervention plan"],
  },
];

const RAG_FALLBACK = {
  answer:
    "The Geo-GraphRAG engine traverses the demo land-knowledge graph across legislation, simulated judgments and spatial layers. Your query did not match a pre-computed evidence path in this offline demo, so the engine returns a general orientation: land-governance questions decompose into title (RoR/NGDRS), possession (resurvey/NAKSHA geometry), use (LULC/zoning) and vulnerability (climate/water) axes — each with its own authoritative source node in the federated mesh.",
  insights: [
    "Try a quick-query chip for a fully pre-computed evidence path.",
    "Queries combining a geography with a driver (e.g., 'peri-urban conversion in Pune') match best.",
  ],
  datasets: ["Federated Source Catalog (demo)"],
  research: ["Land Governance Evidence Compendium (demo repository)"],
  policy: ["DILRMP 3.0 Guidelines (illustrative citation)"],
  layers: ["All demo layers available on the National Map"],
  next: ["Select a quick-query chip below the search bar"],
};

/* ---------------- Taluk risk (Tab 3) extra analytics ---------------- */
const DISPUTE_MIX = [
  { cat: "Inheritance / Mutation", share: 34 },
  { cat: "Boundary Mismatch", share: 22 },
  { cat: "Conversion & Zoning", share: 18 },
  { cat: "Tenancy & Possession", share: 15 },
  { cat: "Mortgage / Encumbrance", share: 11 },
];
