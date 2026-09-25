/* BhumiMitra demo — illustrative local sample data only (no live government feed). */
"use strict";

const SAMPLE_ULPIN = "27PUNEHV110042";

const PARCELS = {
  [SAMPLE_ULPIN]: {
    twin_state: "Disputed",
    risk_score: 0.72,
    soil_index: 0.61,
    water_stress: 0.48,
    climate_vulnerability: 0.55,
    litigation_alert:
      "RCCMS alert: civil suit by an excluded heir pending 6 years — survival model predicts disposal in ~14 months. Boundary mismatch of 0.03 ha flagged in the 2023 resurvey.",
    narrative:
      "Parcel 27PUNEHV110042 (0.9 ha, agricultural) traces to a 1974 tenure grant [src:RoR]. A 1988 partition among three heirs left one transfer unregistered — flagged as an inheritance conflict [src:RoR]. 0.4 ha was converted to non-agricultural use in 2003 [src:RoR], and the balance was sold in 2011 for ₹4.2 lakh [src:NGDRS]. A pending civil suit challenges the partition [src:RCCMS], while 2024 NDVI anomalies suggest partial fallowing [src:Bhuvan].",
    timeline: [
      { when: "1974-06-12", source: "RoR", summary: "Original tenure grant recorded — 0.90 ha agricultural parcel." },
      { when: "1988-02-03", source: "RoR", summary: "Partition among 3 heirs; one share transfer never registered (conflict flag)." },
      { when: "2003-11-20", source: "RoR", summary: "0.40 ha converted to non-agricultural use under Section 44 order." },
      { when: "2011-05-08", source: "NGDRS", summary: "Sale deed registered — consideration ₹4.2 lakh; encumbrance certificate clean at transfer." },
      { when: "2019-09-15", source: "RCCMS", summary: "Civil suit filed by excluded heir challenging 1988 partition; injunction hearing cycles ongoing." },
      { when: "2023-01-27", source: "RoR", summary: "Resurvey records 0.03 ha boundary mismatch against cadastral map (dispute signal)." },
      { when: "2024-08-02", source: "Bhuvan", summary: "Sentinel-2 NDVI anomaly — partial fallowing detected in Kharif window." },
    ],
  },
  "19BENGKV220117": {
    twin_state: "Watch",
    risk_score: 0.34,
    soil_index: 0.78,
    water_stress: 0.62,
    climate_vulnerability: 0.71,
    litigation_alert: null,
    narrative:
      "Parcel 19BENGKV220117 (1.6 ha, agricultural) shows stable ownership since a 1996 inheritance mutation [src:RoR]. Soil organic carbon has declined 11% since 2015 [src:AgriStack], and groundwater exposure places the parcel in a high climate-vulnerability band [src:Bhuvan]. No litigation or boundary conflicts on record [src:RCCMS].",
    timeline: [
      { when: "1996-04-18", source: "RoR", summary: "Inheritance mutation recorded; single-holder title, no subdivision since." },
      { when: "2015-06-30", source: "AgriStack", summary: "Soil Health Card baseline: SOC 0.52%, NPK moderate." },
      { when: "2021-07-14", source: "AgriStack", summary: "Soil Health Card re-issue: SOC 0.46% — 11% decline trend flagged." },
      { when: "2024-03-09", source: "Bhuvan", summary: "Groundwater composite places parcel in high climate-vulnerability band." },
      { when: "2025-11-02", source: "RoR", summary: "Routine mutation request (name correction) — processed in 12 days." },
    ],
  },
};

const $ = (id) => document.getElementById(id);
const ULPIN_RE = /^[A-Z0-9]{14}$/;

function renderParcel(ulpin) {
  const p = PARCELS[ulpin];
  $("twin-ulpin").textContent = ulpin;
  $("twin-narrative").textContent = p.narrative;

  const stateEl = $("twin-state");
  stateEl.textContent = p.twin_state;
  stateEl.className = "twin-state state-" + p.twin_state;

  const metrics = [
    ["soil", p.soil_index],
    ["water", p.water_stress],
    ["climate", p.climate_vulnerability],
    ["risk", p.risk_score],
  ];
  for (const [key, val] of metrics) {
    $("m-" + key).textContent = val.toFixed(2);
    requestAnimationFrame(() => { $("b-" + key).style.width = Math.min(val, 1) * 100 + "%"; });
  }

  const alertEl = $("twin-alert");
  alertEl.hidden = !p.litigation_alert;
  if (p.litigation_alert) alertEl.textContent = "⚖ " + p.litigation_alert;

  const tl = $("twin-timeline");
  tl.innerHTML = "";
  for (const ev of p.timeline) {
    const li = document.createElement("li");
    const when = document.createElement("span");
    when.className = "ev-when";
    when.textContent = ev.when.slice(0, 7);
    const src = document.createElement("span");
    src.className = "ev-src src-" + ev.source;
    src.textContent = ev.source;
    const sum = document.createElement("span");
    sum.textContent = ev.summary;
    li.append(when, src, sum);
    tl.appendChild(li);
  }

  // reset simulator
  $("sim-slider").value = 0;
  updateSim(0);

  $("twin-result").hidden = false;
}

function updateSim(cut) {
  $("sim-val").textContent = "−" + cut + "%";
  const volume = 1 + cut * 0.017;
  const frag = cut * 0.4;
  const benami = Math.min(cut * 2.1, 35);
  $("sim-out").innerHTML =
    cut === 0
      ? "Move the slider to run an illustrative counterfactual (elasticities from the sample simulator calibration)."
      : `Simulated 10-yr transaction volume index: <strong>${volume.toFixed(2)}×</strong> · fragmentation hazard <strong>+${frag.toFixed(1)}%</strong> · formalization of informal transfers <strong>−${benami.toFixed(0)}%</strong> · full ABM run queued on GI Cloud in production.`;
}

function fail(msg) {
  const el = $("twin-error");
  el.textContent = msg;
  el.hidden = false;
  $("twin-result").hidden = true;
}

$("twin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const ulpin = $("ulpin-input").value.trim().toUpperCase();
  $("twin-error").hidden = true;
  if (!ULPIN_RE.test(ulpin)) {
    fail("ULPIN must be exactly 14 alphanumeric characters (state-district-taluka-village-grid-parcel).");
    return;
  }
  if (!PARCELS[ulpin]) {
    fail(`Sample parcel "${ulpin}" not found in this demo dataset. Try ${SAMPLE_ULPIN} or 19BENGKV220117.`);
    return;
  }
  const btn = $("twin-btn");
  btn.disabled = true;
  btn.textContent = "Traversing mesh…";
  setTimeout(() => {
    renderParcel(ulpin);
    btn.disabled = false;
    btn.textContent = "Open Twin";
  }, 650);
});

$("sample-btn").addEventListener("click", () => {
  $("ulpin-input").value = SAMPLE_ULPIN;
  $("twin-form").requestSubmit();
});

$("sim-slider").addEventListener("input", (e) => updateSim(Number(e.target.value)));

// Active-section highlight in top nav
const navLinks = [...document.querySelectorAll(".topbar nav a")];
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        navLinks.forEach((a) =>
          a.style.color = a.getAttribute("href") === "#" + entry.target.id ? "#fff" : ""
        );
      }
    }
  },
  { rootMargin: "-30% 0px -60% 0px" }
);
for (const id of ["vision", "scope", "features", "architecture", "tech", "roadmap", "demo"]) {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
}
