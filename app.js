/* BhumiMitra — self-contained client-side application (demo mode, trilingual). */
"use strict";

/* ============ Helpers ============ */
const $ = (id) => document.getElementById(id);
const fmtInt = (n) => Number(n).toLocaleString("en-IN");
const SESSION_KEY = "bhumimitra_demo_session";
const ROLES = { researcher: "researcher", collector: "collector", lro: "lro" };

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function downloadFile(filename, content, mime) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function downloadCSV(filename, rows) {
  downloadFile(filename, rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv;charset=utf-8");
}
let toastTimer = null;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}
function openModal(title, html) {
  $("modal-title").textContent = title;
  $("modal-body").innerHTML = html;
  $("modal-backdrop").hidden = false;
}
function closeModal() { $("modal-backdrop").hidden = true; }
$("modal-close").addEventListener("click", closeModal);
$("modal-backdrop").addEventListener("click", (e) => { if (e.target === $("modal-backdrop")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeProfileMenu(); closeLangMenu(); } });

/* ============ Language switcher ============ */
function closeLangMenu() {
  $("lang-menu").hidden = true;
  $("lang-btn").setAttribute("aria-expanded", "false");
}
$("lang-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const m = $("lang-menu");
  m.hidden = !m.hidden;
  $("lang-btn").setAttribute("aria-expanded", m.hidden ? "false" : "true");
});
document.addEventListener("click", (e) => {
  if (!$("lang-menu").hidden && !e.target.closest(".lang-wrap")) closeLangMenu();
});
$("lang-menu").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-lang]");
  if (!b) return;
  closeLangMenu();
  setLang(b.dataset.lang);
});

/* ============ Demo gate / session ============ */
function showGate() {
  $("demo-gate").hidden = false;
  $("app-shell").hidden = true;
}
function enterDemo(silent) {
  localStorage.setItem(SESSION_KEY, "1");
  $("demo-gate").hidden = true;
  $("app-shell").hidden = false;
  ensureAppInit();
  requestAnimationFrame(() => {
    Object.values(maps).forEach((m) => m && m.invalidateSize());
    if (landUseChart) landUseChart.resize();
    if (simChart) simChart.resize();
  });
  if (!silent) toast(t("toast.signedIn"));
}
$("gate-continue").addEventListener("click", () => enterDemo(false));

function logout() {
  localStorage.removeItem(SESSION_KEY);
  closeProfileMenu();
  showGate();
  toast(t("toast.loggedOut"));
}

/* ============ Profile menu ============ */
function closeProfileMenu() {
  $("profile-menu").hidden = true;
  $("profile-btn").setAttribute("aria-expanded", "false");
}
$("profile-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const m = $("profile-menu");
  m.hidden = !m.hidden;
  $("profile-btn").setAttribute("aria-expanded", m.hidden ? "false" : "true");
});
document.addEventListener("click", (e) => { if (!$("profile-menu").hidden && !e.target.closest(".profile-wrap")) closeProfileMenu(); });
$("profile-menu").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  closeProfileMenu();
  const act = btn.dataset.act;
  if (act === "profile") {
    openModal(t("profile.modal.title"), `
      <dl class="kv">
        <dt>${t("profile.modal.name")}</dt><dd>${DEMO_USER.name}</dd>
        <dt>${t("profile.modal.role")}</dt><dd>${t("profile.role")}</dd>
        <dt>${t("profile.modal.org")}</dt><dd>${t("profile.org")}</dd>
        <dt>${t("profile.modal.status")}</dt><dd><span class="risk-badge risk-low">${t("profile.status")}</span></dd>
        <dt>${t("profile.modal.session")}</dt><dd>${t("profile.modal.sessionVal")}</dd>
      </dl>
      <h4>${t("profile.modal.can")}</h4>
      <ul>
        <li>${t("profile.modal.can1")}</li>
        <li>${t("profile.modal.can2")}</li>
        <li>${t("profile.modal.can3")}</li>
        <li>${t("profile.modal.can4")}</li>
      </ul>`);
  } else if (act === "reset") {
    resetDemo();
  } else if (act === "logout") {
    logout();
  }
});

/* ============ Tabs & shell ============ */
let currentTab = "dashboard";
const maps = {};
let landUseChart = null, simChart = null;

function activateTab(id) {
  currentTab = id;
  document.querySelectorAll(".navtab").forEach((b) => {
    const on = b.dataset.tab === id;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll(".tabpanel").forEach((p) => {
    const on = p.id === "tab-" + id;
    p.classList.toggle("active", on);
    p.hidden = !on;
  });
  $("mainnav").classList.remove("open");
  $("nav-toggle").setAttribute("aria-expanded", "false");
  requestAnimationFrame(() => {
    Object.values(maps).forEach((m) => m && m.invalidateSize());
    if (id === "dashboard" && landUseChart) landUseChart.resize();
    if (id === "policylab" && simChart) simChart.resize();
  });
  window.scrollTo({ top: 0 });
}
document.querySelectorAll(".navtab").forEach((b) => b.addEventListener("click", () => activateTab(b.dataset.tab)));
$("nav-toggle").addEventListener("click", () => {
  const open = $("mainnav").classList.toggle("open");
  $("nav-toggle").setAttribute("aria-expanded", open ? "true" : "false");
});
$("brand-home").addEventListener("click", (e) => { e.preventDefault(); activateTab("dashboard"); });
$("goto-gis").addEventListener("click", () => activateTab("gis"));
$("goto-research").addEventListener("click", () => activateTab("research"));
$("goto-policylab").addEventListener("click", () => activateTab("policylab"));

/* ============ Role switcher ============ */
function applyRole() {
  const role = $("role-select").value;
  const banner = $("role-banner");
  banner.textContent = t("role.banner." + role);
  banner.hidden = false;
  $("radar-export").hidden = role === "researcher";
  $("radar-export").textContent = role === "collector" ? t("radar.exportCollector") : t("radar.exportLro");
  renderRoleExtra();
}
function renderRoleExtra() {
  const role = $("role-select").value;
  const extra = $("t-role-extra");
  if (!currentParcel) { extra.hidden = true; return; }
  if (role === "lro") {
    extra.hidden = false;
    extra.innerHTML = `<button class="btn btn-ghost" id="ror-export">RoR — ${currentParcel.code} (CSV)</button>`;
    $("ror-export").addEventListener("click", () => downloadCSV(`ror-extract-${currentParcel.code}.csv`, [
      ["Field", "Value (demo)"],
      ["Parcel Code", currentParcel.code], ["ULPIN", currentParcel.ulpin], ["Survey No", currentParcel.surveyNo],
      ["Village / Taluk / District", `${currentParcel.village} / ${currentParcel.taluk} / ${currentParcel.district}`],
      ["Area (Ha)", currentParcel.areaHa], ["Holder", currentParcel.owner], ["Status", t("status." + currentParcel.status)],
    ]));
  } else if (role === "collector") {
    extra.hidden = false;
    extra.innerHTML = `<button class="btn btn-ghost" id="audit-flag">Audit — ${currentParcel.code}</button> <span class="fineprint" id="audit-note"></span>`;
    $("audit-flag").addEventListener("click", () => {
      $("audit-note").textContent = ` ${currentParcel.code} ✔`;
    });
  } else { extra.hidden = true; extra.innerHTML = ""; }
}
$("role-select").addEventListener("change", applyRole);

/* ============ Dashboard · metrics ============ */
function renderMetrics() {
  const labels = METRIC_LABELS[LANG] || METRIC_LABELS.en;
  $("metrics-strip").innerHTML = PLATFORM_METRICS.map((m, i) =>
    `<div class="metric-tile"><div class="mv">${m.value}</div><div class="ml">${labels[i]}</div></div>`).join("");
}

/* ============ Layer i18n maps ============ */
const LAYER_I18N = {
  landuse: { label: "layer.landuse", legend: ["legend.landuse.0", "legend.landuse.1", "legend.landuse.2"] },
  climate: { label: "layer.climate", legend: ["legend.climate.0", "legend.climate.1", "legend.climate.2"] },
  urban: { label: "layer.urban", legend: ["legend.urban.0", "legend.urban.1", "legend.urban.2"] },
  disputes: { label: "layer.disputes", legend: ["legend.disputes.0", "legend.disputes.1", "legend.disputes.2"] },
  infra: { label: "layer.infra", legend: ["legend.infra.0", "legend.infra.1", "legend.infra.2"] },
};

/* ============ Dashboard · national map ============ */
const stateLayers = {};
let lastStateCode = "MH";

function layerColor(code, layerKey) {
  const def = LAYER_DEFS[layerKey];
  const v = def.key(STATES[code]);
  return v >= def.buckets[0] ? def.colors[0] : v >= def.buckets[1] ? def.colors[1] : def.colors[2];
}

function renderNationalMap() {
  if (!maps.national) return;
  const sel = $("state-select").value;
  const layerKey = $("layer-select").value;
  const li = LAYER_I18N[layerKey];
  Object.values(stateLayers).forEach((ly) => maps.national.removeLayer(ly));
  for (const [code, st] of Object.entries(STATES)) {
    const dim = sel !== "ALL" && sel !== code;
    const poly = L.polygon(st.polygon, {
      color: "#1a1a2e", weight: 1.2, opacity: dim ? 0.25 : 0.9,
      fillColor: layerColor(code, layerKey), fillOpacity: dim ? 0.12 : 0.55,
    }).addTo(maps.national);
    const v = LAYER_DEFS[layerKey].key(st);
    poly.bindPopup(
      `<b>${st.name}</b><br/>${t(li.label)}: <b>${typeof v === "number" ? v.toFixed(1) : v}</b><br/>${t("gis.urbanGrowth")}: ${st.urbanExpansion}% · ${t("gis.disputes")}: ${st.disputeDensity}/1k<br/><span style="color:#5c6470">${t("flag.demoPlatform")}</span>`);
    poly.on("click", () => { if (!dim) selectState(code, false); });
    stateLayers[code] = poly;
  }
  $("map-legend").innerHTML =
    `<h4>${t(li.label)}</h4>` +
    li.legend.map((k, i) => `<div class="legend-item"><span class="legend-swatch" style="background:${LAYER_DEFS[layerKey].colors[i]}"></span>${t(k)}</div>`).join("");
  if (sel !== "ALL") maps.national.setView(STATES[sel].center, STATES[sel].zoom);
}

function selectState(code, fromUser) {
  lastStateCode = code;
  if (fromUser) $("state-select").value = code;
  renderNationalMap();
  $("lu-state-name").textContent = STATES[code].name;
  $("cl-state-name").textContent = STATES[code].name;
  $("rs-state-name").textContent = STATES[code].name;
  $("pl-state-name").textContent = STATES[code].name;
  renderLandUse(code);
  renderClimate(code);
  renderStateResearch(code);
  renderStatePolicy(code);
}

function renderStateResearch(code) {
  const items = RESEARCH.filter((r) => r.state === code).slice(0, 4);
  $("state-research").innerHTML = items.length
    ? items.map((r) => `<li><b>${r.title}</b> (${r.year}) — ${t(TYPE_KEYS[r.type])} · <a href="#" data-research="${r.id}" class="rs-link">${t("rs.open")}</a></li>`).join("")
    : `<li>${t("rs.none")}</li>`;
}
function renderStatePolicy(code) {
  const map = STATE_POLICY_I18N[LANG] || STATE_POLICY_NOTES;
  $("state-policy").textContent = map[code] || STATE_POLICY_NOTES[code];
}
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-research]");
  if (link) { e.preventDefault(); showResearchDetails(link.dataset.research); }
});

$("state-select").addEventListener("change", () => {
  const sel = $("state-select").value;
  if (sel === "ALL") { maps.national.setView([20.6, 78.4], 5); renderNationalMap(); }
  else { selectState(sel, false); toast(t("toast.state", { state: STATES[sel].name })); }
});
$("layer-select").addEventListener("change", renderNationalMap);
$("map-reset").addEventListener("click", () => {
  $("state-select").value = "ALL"; $("layer-select").value = "landuse"; $("map-search").value = "";
  $("compare-box").hidden = true;
  maps.national.setView([20.6, 78.4], 5);
  renderNationalMap();
});
$("map-search").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); mapSearch(); } });
$("map-search").addEventListener("search", mapSearch);

function mapSearch() {
  const raw = $("map-search").value.trim();
  const q = raw.toLowerCase();
  if (!q) return;
  for (const [code, st] of Object.entries(STATES)) {
    if (st.name.toLowerCase().includes(q)) { selectState(code, true); toast(t("toast.state", { state: st.name })); return; }
  }
  for (const [sc, tree] of Object.entries(REGIONS_TREE)) {
    for (const [dist, regions] of Object.entries(tree.districts)) {
      if (dist.toLowerCase().includes(q)) { openGisAt(sc, dist, regions[0]); return; }
      const rg = regions.find((r) => r.toLowerCase().includes(q));
      if (rg) { openGisAt(sc, dist, rg); return; }
    }
  }
  const p = PARCELS.find((p) => [p.village, p.taluk, p.district].some((f) => f.toLowerCase().includes(q)));
  if (p) { openParcel(p.code); activateTab("twin"); return; }
  mapSearchFeedback(t("err.search", { q: raw }));
}
function mapSearchFeedback(msg) {
  let el = $("map-search-msg");
  if (!el) {
    el = document.createElement("p");
    el.id = "map-search-msg"; el.className = "form-error";
    $("map-search").parentElement.appendChild(el);
  }
  el.textContent = msg;
}

$("map-compare").addEventListener("click", () => {
  const box = $("compare-box");
  box.hidden = !box.hidden;
  if (!box.hidden) renderCompareBox();
});
function renderCompareBox() {
  const rows = [
    [t("gis.urbanGrowth"), COMPARE_REGIONS.MH.urban, COMPARE_REGIONS.KA.urban],
    [t("gis.agri"), COMPARE_REGIONS.MH.agri, COMPARE_REGIONS.KA.agri],
    [t("gis.forest"), COMPARE_REGIONS.MH.forest, COMPARE_REGIONS.KA.forest],
    [t("gis.composite"), COMPARE_REGIONS.MH.climateRisk, COMPARE_REGIONS.KA.climateRisk],
    [t("gis.infra"), COMPARE_REGIONS.MH.infra, COMPARE_REGIONS.KA.infra],
    [t("gis.disputes"), COMPARE_REGIONS.MH.disputes, COMPARE_REGIONS.KA.disputes],
  ];
  $("compare-body").innerHTML = rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
}

/* ============ Dashboard · land use chart + climate ============ */
function renderLandUse(code) {
  const lu = STATES[code].landUse;
  const cats = LU_CATS[LANG] || LU_CATS.en;
  const data = {
    labels: lu.years.map(String),
    datasets: [
      { label: cats[0], data: lu.agri, backgroundColor: "#2d6a4f" },
      { label: cats[1], data: lu.forest, backgroundColor: "#74a892" },
      { label: cats[2], data: lu.urban, backgroundColor: "#1a1a2e" },
      { label: cats[3], data: lu.water, backgroundColor: "#5b9bd5" },
      { label: cats[4], data: lu.barren, backgroundColor: "#b07d3b" },
    ],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, max: 100, ticks: { callback: (v) => v + "%" } } },
    plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } },
  };
  if (landUseChart) { landUseChart.data = data; landUseChart.update(); }
  else landUseChart = new Chart($("landuse-chart"), { type: "bar", data, options });
}

function renderClimate(code) {
  const c = STATES[code].climate;
  const rows = [[t("climate.flood"), c.flood], [t("climate.drought"), c.drought], [t("climate.landslide"), c.landslide], [t("climate.heat"), c.heat], [t("climate.water"), c.waterStress]];
  $("climate-risks").innerHTML = rows.map(([label, v]) =>
    `<div class="risk-row"><div class="risk-head"><span>${label}</span><span>${v}/100</span></div>
     <div class="risk-bar"><i class="${v >= 65 ? "danger" : v >= 45 ? "warn" : ""}" style="width:${v}%"></i></div></div>`).join("");
}

/* ============ GIS Explorer ============ */
let gisState = "MH", gisDistrict = "Pune", gisRegion = "Haveli";
const gisOverlays = {};

function initGis() {
  maps.gis = L.map("gis-map", { center: STATES.MH.center, zoom: STATES.MH.zoom, minZoom: 4 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 14, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(maps.gis);
  for (const k of ["landuse", "climate", "urban", "disputes", "infra", "water"]) gisOverlays[k] = L.layerGroup();

  $("gis-state").innerHTML = Object.entries(REGIONS_TREE).map(([c, tr]) => `<option value="${c}">${tr.name}</option>`).join("");
  fillGisCascade();
  ["gis-state", "gis-district", "gis-region"].forEach((id) => $(id).addEventListener("change", onGisCascade));
  ["lyr-landuse", "lyr-climate", "lyr-urban", "lyr-disputes", "lyr-infra", "lyr-water"].forEach((id) => $(id).addEventListener("change", () => renderGisLayers(false)));
  $("gis-reset").addEventListener("click", () => {
    gisState = "MH"; gisDistrict = "Pune"; gisRegion = "Haveli";
    $("gis-state").value = gisState; fillGisCascade();
    maps.gis.setView(STATES.MH.center, STATES.MH.zoom);
    renderGisLayers(false);
    toast(t("toast.gisReset"));
  });
  renderGisLayers(false);
}

function fillGisCascade() {
  const districts = Object.keys(REGIONS_TREE[gisState].districts);
  if (!districts.includes(gisDistrict)) gisDistrict = districts[0];
  $("gis-district").innerHTML = districts.map((d) => `<option ${d === gisDistrict ? "selected" : ""}>${d}</option>`).join("");
  const regions = REGIONS_TREE[gisState].districts[gisDistrict];
  if (!regions.includes(gisRegion)) gisRegion = regions[0];
  $("gis-region").innerHTML = regions.map((r) => `<option ${r === gisRegion ? "selected" : ""}>${r}</option>`).join("");
}

function onGisCascade() {
  const s = $("gis-state").value, d = $("gis-district").value, r = $("gis-region").value;
  gisState = s;
  const districts = Object.keys(REGIONS_TREE[gisState].districts);
  gisDistrict = districts.includes(d) ? d : districts[0];
  const regions = REGIONS_TREE[gisState].districts[gisDistrict];
  gisRegion = regions.includes(r) ? r : regions[0];
  fillGisCascade();
  renderGisLayers(true);
}

function openGisAt(stateCode, district, region) {
  gisState = stateCode; gisDistrict = district; gisRegion = region;
  $("gis-state").value = stateCode; fillGisCascade();
  $("gis-district").value = district;
  const regions = REGIONS_TREE[stateCode].districts[district];
  $("gis-region").innerHTML = regions.map((r) => `<option ${r === region ? "selected" : ""}>${r}</option>`).join("");
  activateTab("gis");
  setTimeout(() => renderGisLayers(true), 60);
  toast(t("toast.gisOpen", { state: REGIONS_TREE[stateCode].name, district, region }));
}

function renderGisLayers(fly) {
  const map = maps.gis;
  if (!map) return;
  Object.values(gisOverlays).forEach((g) => { g.clearLayers(); map.removeLayer(g); });

  const st = STATES[gisState];
  L.polygon(st.polygon, { color: "#1a1a2e", weight: 1.5, opacity: 0.8, fillColor: "#2d6a4f", fillOpacity: 0.06 }).addTo(gisOverlays.landuse);

  const districts = REGIONS_TREE[gisState].districts;
  for (const [dist, regions] of Object.entries(districts)) {
    for (const region of regions) {
      const m = regionMetrics(gisState, region);
      const inFocus = dist === gisDistrict;
      const isSel = region === gisRegion && inFocus;
      const coords = m.coords;

      if ($("lyr-landuse").checked) {
        const green = m.agri >= 50 ? "#2d6a4f" : m.agri >= 42 ? "#74a892" : "#b07d3b";
        L.circle(coords, { radius: isSel ? 9000 : 6000, color: green, weight: isSel ? 3 : 1.5, fillColor: green, fillOpacity: inFocus ? 0.35 : 0.12 })
          .bindPopup(gisPopup(region, dist, m)).addTo(gisOverlays.landuse);
      }
      if ($("lyr-climate").checked && inFocus) {
        const col = m.climateRisk >= 70 ? "#dc2626" : m.climateRisk >= 55 ? "#e08a3c" : "#2d6a4f";
        L.circle(coords, { radius: 12000, color: col, weight: 1, fillColor: col, fillOpacity: 0.25, dashArray: "4 4" })
          .bindPopup(`<b>${region}</b> — ${t("gis.composite")}: <b>${m.climateRisk}</b><br/>${t("gis.waterStress")}: ${m.waterStress}/100<br/><span style="color:#5c6470">${t("flag.demo")}</span>`)
          .addTo(gisOverlays.climate);
      }
      if ($("lyr-urban").checked && inFocus) {
        L.circle(coords, { radius: 3000 + m.urbanGrowth * 900, color: "#1a1a2e", weight: 1.5, fillColor: "#1a1a2e", fillOpacity: 0.3 })
          .bindPopup(`<b>${region}</b> — ${t("gis.urbanGrowth")}: <b>+${m.urbanGrowth}%</b>`).addTo(gisOverlays.urban);
      }
      if ($("lyr-disputes").checked && m.disputes >= 5.5) {
        L.circleMarker(coords, { radius: 8, color: "#7f1d1d", weight: 2, fillColor: "#dc2626", fillOpacity: 0.85 })
          .bindPopup(`<b>${region}</b> — ${t("lyr.disputes")}<br/>${m.disputes}/1k (${t("flag.demo")})`).addTo(gisOverlays.disputes);
      }
      if ($("lyr-infra").checked && m.infra >= 60) {
        L.circleMarker([coords[0] + 0.06, coords[1] + 0.06], { radius: 6, color: "#1e40af", weight: 1.5, fillColor: "#5b9bd5", fillOpacity: 0.9 })
          .bindPopup(`<b>${region}</b> — ${t("lyr.infra")} ${m.infra}/100`).addTo(gisOverlays.infra);
      }
      if ($("lyr-water").checked && inFocus) {
        L.circle([coords[0] - 0.09, coords[1] - 0.07], { radius: 3500, color: "#0369a1", weight: 1, fillColor: "#7dd3fc", fillOpacity: 0.5 })
          .bindPopup(`${t("legend.gis.water")} · ${region} · ${m.waterStress}/100`).addTo(gisOverlays.water);
      }
    }
  }

  Object.entries(gisOverlays).forEach(([k, g]) => { if ($("lyr-" + k).checked) g.addTo(map); });
  renderGisLegend();
  renderGisInfo();

  const rm = regionMetrics(gisState, gisRegion);
  if (fly) map.setView(rm.coords, 10);
}

function gisPopup(region, dist, m) {
  return `<b>${region}</b> (${dist})<br/>${t("gis.agri")}: ${m.agri}% · ${t("gis.urbanGrowth")}: +${m.urbanGrowth}%<br/>${t("gis.composite")}: ${m.climateRisk} · ${t("gis.disputes")}: ${m.disputes}/1k<br/>${t("gis.infra")}: ${m.infra}/100 · ${t("gis.population")}: ${fmtInt(m.population)}<br/><span style="color:#5c6470">${t("flag.demo")}</span>`;
}

function renderGisLegend() {
  const rows = [];
  if ($("lyr-landuse").checked) rows.push(["#2d6a4f", t("legend.landuse.0")], ["#74a892", t("legend.landuse.1")], ["#b07d3b", t("legend.landuse.2")]);
  if ($("lyr-climate").checked) rows.push(["#dc2626", t("legend.climate.0")], ["#e08a3c", t("legend.climate.1")], ["#2d6a4f", t("legend.climate.2")]);
  if ($("lyr-disputes").checked) rows.push(["#dc2626", t("legend.gis.disputes")]);
  if ($("lyr-infra").checked) rows.push(["#5b9bd5", t("legend.gis.infra")]);
  if ($("lyr-urban").checked) rows.push(["#1a1a2e", t("legend.gis.urban")]);
  if ($("lyr-water").checked) rows.push(["#7dd3fc", t("legend.gis.water")]);
  $("gis-legend").innerHTML = `<h4>${t("gis.legend")}</h4>` + (rows.length
    ? rows.map((r) => `<div class="legend-item"><span class="legend-swatch" style="background:${r[0]}"></span>${r[1]}</div>`).join("")
    : `<p class="fineprint">${t("gis.legendNone")}</p>`);
}

function renderGisInfo() {
  const m = regionMetrics(gisState, gisRegion);
  $("gis-region-info").innerHTML = `
    <h3>${gisRegion} — ${t("gis.infoTitle")} <span class="demo-flag small">${t("flag.demo")}</span></h3>
    <div class="region-kv">
      <div><span>${t("gis.agri")}</span><b>${m.agri}%</b></div>
      <div><span>${t("gis.forest")}</span><b>${m.forest}%</b></div>
      <div><span>${t("gis.urbanGrowth")}</span><b>+${m.urbanGrowth}%</b></div>
      <div><span>${t("gis.population")}</span><b>${fmtInt(m.population)}</b></div>
      <div><span>${t("gis.disputes")}</span><b>${m.disputes}</b></div>
      <div><span>${t("gis.infra")}</span><b>${m.infra}/100</b></div>
    </div>`;
  const ws = m.waterStress, cr = m.climateRisk;
  const adv = cr >= 65 ? t("gis.advHigh") : cr >= 45 ? t("gis.advMod") : t("gis.advLow");
  $("gis-climate-info").innerHTML = `
    <h3>${gisRegion} — ${t("gis.climateTitle")} <span class="demo-flag small">${t("flag.simulated")}</span></h3>
    <div class="risk-list">
      <div class="risk-row"><div class="risk-head"><span>${t("gis.waterStress")}</span><span>${ws}/100</span></div><div class="risk-bar"><i class="${ws >= 65 ? "danger" : ws >= 45 ? "warn" : ""}" style="width:${ws}%"></i></div></div>
      <div class="risk-row"><div class="risk-head"><span>${t("gis.composite")}</span><span>${cr}/100</span></div><div class="risk-bar"><i class="${cr >= 65 ? "danger" : cr >= 45 ? "warn" : ""}" style="width:${cr}%"></i></div></div>
    </div>
    <p class="fineprint">${adv}</p>`;
}

/* ============ Policy Lab · Sandbox ============ */
const sandboxRuns = [];
let lastSandboxRun = null, lastPreset = null;
const CHANGE_FACTORS = {
  "agri-industrial": { agri: 1.0, jobs: 8.5, cost: 6.2, water: -14 },
  "agri-urban": { agri: 1.0, jobs: 5.0, cost: 4.8, water: -9 },
  "agri-solar": { agri: 0.95, jobs: 1.6, cost: 3.1, water: +4 },
  "forest-eco": { agri: 0.0, jobs: 2.2, cost: 1.4, water: +12 },
  "agri-protect": { agri: 0.0, jobs: 1.2, cost: 0.8, water: +8 },
};
const POLICY_MODS = { conversion: 1.0, pooling: 0.82, lease: 0.7, acquisition: 1.15 };

function computeScenario(region, change, area, policy, horizon) {
  const rnd = mulberry32(hashStr(region + change + area + policy + horizon));
  const f = CHANGE_FACTORS[change], pm = POLICY_MODS[policy];
  const jitter = () => 0.85 + rnd() * 0.3;
  const agriLoss = Math.round(area * f.agri * jitter());
  const jobs = Math.round(area * f.jobs * pm * jitter());
  const households = Math.round(area * (f.agri === 0 ? 0.4 : 2.4) * jitter());
  const infraInvest = Math.round(area * f.cost * pm * jitter() * (horizon / 10));
  const gva = Math.round(infraInvest * (2.6 + rnd() * 1.2) * 10) / 10;
  const waterDelta = Math.round(f.water * (f.water < 0 ? pm : 1) * jitter() * 10) / 10;
  const climateIdx = f.agri === 0 ? -(3 + Math.round(rnd() * 4)) : Math.round(2 + rnd() * 6 * pm);
  const envScore = f.agri === 0 ? +(1.8 + rnd()).toFixed(1) : -(0.6 + rnd() * 1.8);
  const disputes = Math.max(2, Math.round((households * 0.06 + agriLoss * 0.01) * pm * jitter()));
  return { agriLoss, jobs, households, infraInvest, gva, waterDelta, climateIdx, envScore, disputes };
}

$("sandbox-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const region = $("sb-region").value, change = $("sb-change").value;
  const area = Number($("sb-area").value), policy = $("sb-policy").value, horizon = Number($("sb-horizon").value);
  const err = $("sandbox-error");
  if (!Number.isFinite(area) || area < 10 || area > 100000) {
    err.textContent = t("err.area"); err.hidden = false; return;
  }
  err.hidden = true;
  $("sandbox-result").hidden = true;
  $("sandbox-loading").hidden = false;
  $("sb-run").disabled = true;
  setTimeout(() => {
    const im = computeScenario(region, change, area, policy, horizon);
    const run = { region, change, area, policy, horizon, impacts: im };
    sandboxRuns.push(run);
    if (sandboxRuns.length > 2) sandboxRuns.shift();
    lastSandboxRun = run;
    renderSandbox();
    $("sandbox-loading").hidden = true;
    $("sb-run").disabled = false;
    toast(t("toast.simDone"));
  }, 1200);
});

function changeLabel(key) { return t("ch." + { "agri-industrial": "industrial", "agri-urban": "urban", "agri-solar": "solar", "forest-eco": "eco", "agri-protect": "protect" }[key]); }

function renderSandbox() {
  const run = lastSandboxRun;
  if (!run) return;
  const im = run.impacts, region = run.region;
  const label = `${STATES[region].name} · ${changeLabel(run.change)} · ${fmtInt(run.area)} ha · ${run.horizon} yr`;
  $("sandbox-flow").innerHTML = `
    <div class="flow-cell"><strong>${t("flow.current")}</strong>${t("flow.currentBody", { state: STATES[region].name, agri: STATES[region].landUse.agri[2], water: STATES[region].climate.waterStress, disp: STATES[region].disputeDensity })}</div>
    <div class="flow-arrow">→</div>
    <div class="flow-cell"><strong>${t("flow.scenario")}</strong>${t("flow.scenarioBody", { label })}</div>
    <div class="flow-arrow">→</div>
    <div class="flow-cell"><strong>${t("flow.impact")}</strong>${t("flow.impactBody")}</div>`;

  const cards = [
    { l: t("imp.agri"), v: fmtInt(im.agriLoss) + " ha", d: t("impd.agri"), c: im.agriLoss > 0 ? "neg" : "" },
    { l: t("imp.pop"), v: fmtInt(im.households), d: t("impd.pop"), c: "mid" },
    { l: t("imp.jobs"), v: fmtInt(im.jobs), d: t("impd.jobs"), c: "" },
    { l: t("imp.infra"), v: "₹" + fmtInt(im.infraInvest) + " Cr", d: t("impd.infra"), c: "" },
    { l: t("imp.gva"), v: "₹" + im.gva.toFixed(1) + " Cr", d: t("impd.gva"), c: "" },
    { l: t("imp.water"), v: (im.waterDelta > 0 ? "+" : "") + im.waterDelta + "%", d: t("impd.water"), c: im.waterDelta < 0 ? "neg" : "" },
    { l: t("imp.climate"), v: (im.climateIdx > 0 ? "+" : "") + im.climateIdx + " pts", d: t("impd.climate"), c: im.climateIdx > 0 ? "neg" : "" },
    { l: t("imp.env"), v: (im.envScore > 0 ? "+" : "") + im.envScore.toFixed(1), d: t("impd.env"), c: im.envScore < 0 ? "neg" : "" },
    { l: t("imp.disputes"), v: fmtInt(im.disputes), d: t("impd.disputes"), c: im.disputes > 40 ? "neg" : "mid" },
  ];
  $("sandbox-impacts").innerHTML = cards.map((k) =>
    `<div class="impact-card ${k.c}"><div class="iv">${k.v}</div><div class="il">${k.l}</div><div class="id">${k.d}</div></div>`).join("");

  const cmp = $("scenario-compare");
  if (sandboxRuns.length === 2) {
    cmp.hidden = false;
    const [A, B] = sandboxRuns;
    $("sa-head").textContent = "A — " + STATES[A.region].name + " · " + changeLabel(A.change);
    $("sb-head").textContent = "B — " + STATES[B.region].name + " · " + changeLabel(B.change);
    $("scenario-body").innerHTML = scenarioRows(A.impacts, B.impacts);
    $("scenario-note").textContent = t("cmp.note");
  } else cmp.hidden = true;

  $("sandbox-result").hidden = false;
}

function scenarioRows(a, b) {
  const rows = [
    [t("imp.agri"), a.agriLoss, b.agriLoss],
    [t("imp.jobs"), a.jobs, b.jobs],
    [t("imp.pop"), a.households, b.households],
    [t("imp.infra"), a.infraInvest, b.infraInvest],
    [t("imp.gva"), a.gva, b.gva],
    [t("imp.water"), a.waterDelta, b.waterDelta],
    [t("imp.climate"), a.climateIdx, b.climateIdx],
    [t("imp.env"), a.envScore, b.envScore],
    [t("imp.disputes"), a.disputes, b.disputes],
  ];
  return rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${fmtInt(r[1])}</td><td>${fmtInt(r[2])}</td></tr>`).join("");
}

$("compare-scenarios-btn").addEventListener("click", () => {
  const A = SCENARIO_PRESETS.A, B = SCENARIO_PRESETS.B;
  lastPreset = {
    ia: computeScenario(A.region, A.change, A.area, A.policy, A.horizon),
    ib: computeScenario(B.region, B.change, B.area, B.policy, B.horizon),
  };
  renderPresetCompare();
  toast(t("toast.compare"));
});

function renderPresetCompare() {
  if (!lastPreset) return;
  const { ia, ib } = lastPreset;
  const A = SCENARIO_PRESETS.A, B = SCENARIO_PRESETS.B;
  const cardHtml = (titleKey, p, im) => `
    <h4>${t(titleKey)} <span class="demo-flag small">${t("flag.simResult")}</span></h4>
    <div class="region-kv">
      <div><span>${t("preset.region")}</span><b>${STATES[p.region].name} · ${fmtInt(p.area)} ha · ${p.horizon} yr</b></div>
      <div><span>${t("imp.agri")}</span><b>${fmtInt(im.agriLoss)} ha</b></div>
      <div><span>${t("imp.jobs")}</span><b>${fmtInt(im.jobs)}</b></div>
      <div><span>${t("imp.pop")}</span><b>${fmtInt(im.households)}</b></div>
      <div><span>${t("imp.infra")}</span><b>${fmtInt(im.infraInvest)}</b></div>
      <div><span>${t("imp.water")}</span><b>${im.waterDelta > 0 ? "+" : ""}${im.waterDelta}%</b></div>
      <div><span>${t("imp.climate")}</span><b>${im.climateIdx > 0 ? "+" : ""}${im.climateIdx} pts</b></div>
      <div><span>${t("imp.env")}</span><b>${im.envScore > 0 ? "+" : ""}${im.envScore.toFixed(1)}</b></div>
      <div><span>${t("imp.disputes")}</span><b>${fmtInt(im.disputes)}</b></div>
    </div>`;
  $("preset-a").innerHTML = cardHtml("preset.a", A, ia);
  $("preset-b").innerHTML = cardHtml("preset.b", B, ib);
  $("preset-body").innerHTML = scenarioRows(ia, ib);
  $("preset-compare").hidden = false;
}

/* ============ Policy Lab · Counterfactual Simulator ============ */
const SIM_YEARS = Array.from({ length: 11 }, (_, i) => 2026 + i);

function computeProjections(ceiling, stamp, tenancy) {
  const g = Math.min(0.12, Math.max(-0.03, 0.05 + 0.0012 * (tenancy - 50) + 0.004 * (6 - stamp) - 0.0006 * Math.abs(ceiling)));
  const credit = []; let c = 12000;
  for (let i = 0; i < 11; i++) { credit.push(Math.round(c)); c *= (1 + g); }
  const disputeDelta = -0.9 - 0.055 * (tenancy - 50) + 0.05 * Math.max(0, -ceiling) + 0.9 * Math.max(0, 3 - stamp);
  const dispute = []; let d = 100;
  for (let i = 0; i < 11; i++) { dispute.push(Math.max(35, Math.round(d))); d += disputeDelta; }
  const fragDelta = 0.8 + 0.28 * (6 - stamp) - 0.035 * ceiling - 0.02 * (tenancy - 50);
  const frag = []; let f2 = 100;
  for (let i = 0; i < 11; i++) { frag.push(Math.max(60, Math.round(f2))); f2 += fragDelta; }
  return { credit, dispute, frag };
}

function renderSim() {
  const ceiling = Number($("sl-ceiling").value), stamp = Number($("sl-stamp").value), tenancy = Number($("sl-tenancy").value);
  $("out-ceiling").textContent = (ceiling > 0 ? "+" : "") + ceiling + "%";
  $("out-stamp").textContent = stamp.toFixed(1) + "%";
  $("out-tenancy").textContent = tenancy;

  const { credit, dispute, frag } = computeProjections(ceiling, stamp, tenancy);
  const creditGrowth = ((credit[10] / credit[0] - 1) * 100).toFixed(0);
  const dEnd = dispute[10], fEnd = frag[10];

  const data = {
    labels: SIM_YEARS.map(String),
    datasets: [
      { label: t("sim.ds.credit"), data: credit, yAxisID: "y1", borderColor: "#2d6a4f", backgroundColor: "rgba(45,106,79,0.08)", tension: 0.3, fill: true, borderWidth: 2.5 },
      { label: t("sim.ds.dispute"), data: dispute, yAxisID: "y", borderColor: "#dc2626", tension: 0.3, borderWidth: 2, pointRadius: 2 },
      { label: t("sim.ds.frag"), data: frag, yAxisID: "y", borderColor: "#b07d3b", borderDash: [6, 4], tension: 0.3, borderWidth: 2, pointRadius: 2 },
    ],
  };
  const options = {
    responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
    scales: {
      y: { position: "left", title: { display: true, text: "Index (2026 = 100)" }, grid: { color: "#eeece6" } },
      y1: { position: "right", title: { display: true, text: "₹ Cr" }, grid: { drawOnChartArea: false } },
      x: { grid: { display: false } },
    },
    plugins: { legend: { position: "bottom", labels: { boxWidth: 14, font: { size: 11.5 } } } },
  };
  if (simChart) { simChart.data = data; simChart.update(); }
  else simChart = new Chart($("sim-chart"), { type: "line", data, options });

  let verdictKey, vars, tone;
  vars = { g: creditGrowth, d: dEnd, f: fEnd };
  if (dEnd >= 112) { verdictKey = "verdict.conflict"; tone = "bad"; }
  else if (fEnd >= 128) { verdictKey = "verdict.frag"; tone = "warn"; }
  else if (dEnd <= 92 && fEnd <= 112 && Number(creditGrowth) >= 40) { verdictKey = "verdict.good"; tone = "good"; }
  else { verdictKey = "verdict.balanced"; tone = "mid"; }
  $("sim-verdict").innerHTML = `<strong>${t("verdict.label")}</strong>${t(verdictKey, vars)}`;
  $("sim-verdict").style.background = tone === "bad" ? "#4a1d1d" : tone === "good" ? "#14352a" : "var(--ink)";

  const gList = [];
  if (ceiling <= -15) gList.push({ t: t("gr.ceilingTight", { v: ceiling }), safe: false });
  if (ceiling >= 20) gList.push({ t: t("gr.ceilingLoose", { v: ceiling }), safe: false });
  if (stamp <= 2.5) gList.push({ t: t("gr.stampLow", { v: stamp.toFixed(1) }), safe: false });
  if (stamp >= 7.5) gList.push({ t: t("gr.stampHigh", { v: stamp.toFixed(1) }), safe: false });
  if (tenancy >= 80) gList.push({ t: t("gr.tenHigh", { v: tenancy }), safe: true });
  if (tenancy <= 30) gList.push({ t: t("gr.tenLow", { v: tenancy }), safe: false });
  gList.push({ t: t("gr.pilot"), safe: true });
  $("sim-guardrails").innerHTML = gList.map((g) => `<li class="${g.safe ? "safe" : ""}">${g.t}</li>`).join("");
}
["sl-ceiling", "sl-stamp", "sl-tenancy"].forEach((id) => $(id).addEventListener("input", renderSim));
$("sim-recalc").addEventListener("click", () => { renderSim(); toast(t("toast.recalc")); });

/* ============ Digital Land Twin — region level ============ */
let twinState = "MH", twinDistrict = "Pune", twinRegion = "Wagholi";

function initTwinCascade() {
  $("twin-state").innerHTML = Object.entries(REGIONS_TREE).map(([c, tr]) => `<option value="${c}">${tr.name}</option>`).join("");
  fillTwinCascade();
  $("twin-state").addEventListener("change", () => { twinState = $("twin-state").value; twinDistrict = null; twinRegion = null; fillTwinCascade(); renderRegionTwin(); });
  $("twin-district").addEventListener("change", () => { twinDistrict = $("twin-district").value; twinRegion = null; fillTwinCascade(); renderRegionTwin(); });
  $("twin-region").addEventListener("change", () => { twinRegion = $("twin-region").value; renderRegionTwin(); });
  renderRegionTwin();
}
function fillTwinCascade() {
  const districts = Object.keys(REGIONS_TREE[twinState].districts);
  if (!districts.includes(twinDistrict)) twinDistrict = districts[0];
  $("twin-district").innerHTML = districts.map((d) => `<option ${d === twinDistrict ? "selected" : ""}>${d}</option>`).join("");
  const regions = REGIONS_TREE[twinState].districts[twinDistrict];
  if (!regions.includes(twinRegion)) twinRegion = regions[0];
  $("twin-region").innerHTML = regions.map((r) => `<option ${r === twinRegion ? "selected" : ""}>${r}</option>`).join("");
}
function renderRegionTwin() {
  const td = regionTwinData(twinState, twinRegion);
  const card = (era, d) => `
    <div class="ppf-card ${era}">
      <span class="ppf-era">${t("era." + era)}</span>
      <div class="ppf-year">${d.year}</div>
      <div class="region-kv">
        <div><span>${t("m.agri")}</span><b>${d.agri}%</b></div>
        <div><span>${t("m.urban")}</span><b>${d.urban}%</b></div>
        <div><span>${t("m.water")}</span><b>${d.water}/100</b></div>
        <div><span>${t("m.disputes")}</span><b>${d.disputes}</b></div>
        <div><span>${t("m.infra")}</span><b>${d.infra}/100</b></div>
      </div>
      <p class="ppf-note">${t("ppfn." + era)}</p>
    </div>`;
  $("twin-ppf").innerHTML =
    card("past", td.past) + '<div class="ppf-arrow">→</div>' +
    card("present", td.present) + '<div class="ppf-arrow">→</div>' +
    card("future", td.future);
  $("twin-ppf-note").textContent = t("twin.note", { region: twinRegion, district: twinDistrict, state: REGIONS_TREE[twinState].name });
}

/* ============ Parcel Biography ============ */
let parcelMap = null, parcelOverlay = null, currentParcel = null;

function renderQuickChips() {
  $("quick-parcels").innerHTML = PARCELS.map((p) =>
    `<button class="chip" data-code="${p.code}" title="${p.village}, ${p.taluk}, ${p.district}">${t("flag.demoParcel")} · ${p.code} · ${p.village}</button>`).join("");
}
$("quick-parcels").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-code]");
  if (btn) { $("parcel-search").value = btn.dataset.code; openParcel(btn.dataset.code); }
});

function findParcel(q) {
  q = q.trim().toUpperCase();
  if (!q) return null;
  return PARCELS.find((p) =>
    p.code.toUpperCase() === q || p.ulpin.toUpperCase() === q ||
    p.surveyNo.toUpperCase() === q || p.code.toUpperCase().includes(q) ||
    p.ulpin.toUpperCase().includes(q) ||
    p.village.toUpperCase().includes(q) || p.taluk.toUpperCase().includes(q) ||
    p.district.toUpperCase().includes(q));
}

function parcelError(msg) {
  const el = $("parcel-error");
  el.textContent = msg; el.hidden = false;
  $("twin-detail").hidden = true; $("twin-empty").hidden = false;
}

function parcelLocalized(p) {
  const entry = PARCEL_I18N[p.code];
  if (!entry) return null;
  return entry[LANG] || entry.en || null;
}

function openParcel(code) {
  const p = findParcel(code);
  $("parcel-error").hidden = true;
  if (!p) { parcelError(t("err.parcel", { q: code })); return; }
  currentParcel = p;
  $("twin-empty").hidden = true;
  $("twin-detail").hidden = false;

  const statusMap = { disputed: "status-disputed", clean: "status-clean", watch: "status-watch" };
  const badge = $("parcel-status");
  badge.textContent = t("status." + p.status);
  badge.className = "status-badge " + statusMap[p.status];

  $("t-ulpin").textContent = p.ulpin + "  ·  " + p.code;
  $("t-geo").textContent = `${p.village}, ${p.taluk}, ${p.district}, ${p.state}`;
  $("t-metrics").innerHTML = `
    <div class="metric-box"><div class="mb-l">${t("twin.survey")}</div><div class="mb-v">${p.surveyNo}</div><div class="mb-s">${p.areaHa.toFixed(2)} Ha</div></div>
    <div class="metric-box"><div class="mb-l">${t("twin.ownership")}</div><div class="mb-v" style="font-size:13.5px">${p.owner}</div><div class="mb-s">${t("twin.ownerNote")}</div></div>
    <div class="metric-box"><div class="mb-l">${t("twin.soil")}</div><div class="mb-v">${p.soilIndex.toFixed(1)}/10</div><div class="mb-s">${p.soilNote} · SHC (${t("flag.demo")})</div></div>
    <div class="metric-box"><div class="mb-l">${t("twin.vuln")}</div><div class="mb-v">${p.climateScore.toFixed(1)}</div><div class="mb-s">${p.climateNote} · PVI v1 (${t("flag.demo")})</div></div>`;
  $("t-zoning").textContent = "🏷 " + p.zoning;

  const loc = parcelLocalized(p);
  $("t-bio").textContent = loc ? loc.bio : p.biography;

  const color = p.status === "disputed" ? "#dc2626" : p.status === "watch" ? "#b07d3b" : "#2d6a4f";
  $("t-timeline").innerHTML = p.timeline.map((ev, i) => {
    const tl = loc && loc.tl && loc.tl[i] ? loc.tl[i] : [ev.title, ev.text];
    return `
    <li class="lt-item ${ev.tag === "RCCMS" || ev.title.includes("Injunction") ? "hot" : ""}" data-idx="${i}" tabindex="0" role="button" aria-expanded="false">
      <span class="lt-year">${ev.year}</span><span class="lt-tag">${ev.tag}</span><span class="lt-expand-hint">${t("twin.expandHint")}</span>
      <div class="lt-title">${tl[0]}</div><div class="lt-text">${tl[1]}</div>
      <div class="lt-details">${ev.details || "—"}</div>
    </li>`;
  }).join("");

  if (!parcelMap) {
    parcelMap = L.map("parcel-map", { zoomControl: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(parcelMap);
    maps.parcel = parcelMap;
  }
  if (parcelOverlay) parcelOverlay.remove();
  parcelOverlay = L.layerGroup().addTo(parcelMap);
  L.polygon(p.polygon, { color, weight: 3, fillColor: color, fillOpacity: 0.22 })
    .bindPopup(`<b>${p.surveyNo}</b> — ${t("flag.demoParcel")}<br/>${p.areaHa.toFixed(2)} Ha · ${t("status." + p.status)}`)
    .addTo(parcelOverlay);
  L.marker(p.center, {
    icon: L.divIcon({
      className: "", html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8],
    }),
  }).bindPopup(`<b>${p.owner}</b><br/>${p.surveyNo} · ${p.areaHa.toFixed(2)} Ha<br/>${p.village}, ${p.taluk}, ${p.district}<br/><span style="color:#5c6470">${t("flag.demoParcel")}</span>`)
    .addTo(parcelOverlay).openPopup();
  parcelMap.setView(p.center, 14);
  requestAnimationFrame(() => parcelMap.invalidateSize());
  renderRoleExtra();
}

$("t-timeline").addEventListener("click", (e) => {
  const li = e.target.closest("li.lt-item");
  if (li) { li.classList.toggle("open"); li.setAttribute("aria-expanded", li.classList.contains("open") ? "true" : "false"); }
});
$("t-timeline").addEventListener("keydown", (e) => {
  const li = e.target.closest("li.lt-item");
  if (li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); li.click(); }
});

$("parcel-search-btn").addEventListener("click", () => {
  const q = $("parcel-search").value;
  if (!q.trim()) { parcelError(t("err.parcelEmpty")); return; }
  openParcel(q);
});
$("parcel-search").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("parcel-search-btn").click(); } });

/* ============ Dispute Radar ============ */
function renderRadar() {
  const high = TALUK_RISK.filter((x) => x.risk === "high").length;
  const totalCases = TALUK_RISK.reduce((s, x) => s + x.pending, 0);
  const totalParcels = TALUK_RISK.reduce((s, x) => s + x.parcels, 0);
  $("radar-summary").innerHTML = `
    <div class="metric-tile"><div class="mv">${TALUK_RISK.length}</div><div class="ml">${t("rsum.monitored")}</div></div>
    <div class="metric-tile"><div class="mv" style="color:var(--red)">${high}</div><div class="ml">${t("rsum.high")}</div></div>
    <div class="metric-tile"><div class="mv">+18%</div><div class="ml">${t("rsum.surge")}</div></div>
    <div class="metric-tile"><div class="mv">${fmtInt(totalCases)}</div><div class="ml">${t("rsum.pending", { n: fmtInt(totalParcels) })}</div></div>`;
  const mix = MIX_LABELS[LANG] || MIX_LABELS.en;
  $("dispute-mix").innerHTML = DISPUTE_MIX.map((d, i) =>
    `<div class="risk-row"><div class="risk-head"><span>${mix[i]}</span><span>${d.share}%</span></div>
     <div class="risk-bar"><i class="${d.share >= 30 ? "danger" : d.share >= 18 ? "warn" : ""}" style="width:${d.share * 2.4}%"></i></div></div>`).join("");
}

let radarHighOnly = false;
function renderRadarTable() {
  const rows = radarHighOnly ? TALUK_RISK.filter((x) => x.risk === "high") : TALUK_RISK;
  const badge = { high: ["risk-high", t("badge.high")], medium: ["risk-medium", t("badge.medium")], low: ["risk-low", t("badge.low")] };
  $("radar-body").innerHTML = rows.map((x) => {
    const loc = (TALUK_I18N[x.taluk] && TALUK_I18N[x.taluk][LANG]) || { driver: x.driver, intervention: x.intervention };
    return `
    <tr>
      <td>${x.taluk}<br/><span style="font-weight:400;color:var(--muted);font-size:12.5px">${x.district}</span></td>
      <td><span class="risk-badge ${badge[x.risk][0]}">${badge[x.risk][1]}</span></td>
      <td class="num">${fmtInt(x.parcels)}</td>
      <td class="num">${fmtInt(x.pending)}</td>
      <td>${x.pendency}</td>
      <td>${loc.driver}</td>
      <td>${loc.intervention}</td>
    </tr>`;
  }).join("");
}
$("radar-filter-high").addEventListener("click", () => {
  radarHighOnly = !radarHighOnly;
  $("radar-filter-high").textContent = radarHighOnly ? t("radar.filterAll") : t("radar.filterHigh");
  renderRadarTable();
});
$("radar-export").addEventListener("click", () => {
  const role = $("role-select").value;
  const head = role === "collector"
    ? ["Taluk", "District", "Risk", "Intervention", "Camp Frequency (demo)", "Est. Case-Years Saved (demo)"]
    : ["Taluk", "District", "Risk", "Resurvey Priority", "Boundary Mismatch Parcels (demo)", "Queue Position"];
  const rows = [head];
  TALUK_RISK.filter((x) => role === "collector" ? true : x.risk !== "low").forEach((x, i) => {
    const loc = (TALUK_I18N[x.taluk] && TALUK_I18N[x.taluk][LANG]) || { driver: x.driver, intervention: x.intervention };
    rows.push(role === "collector"
      ? [x.taluk, x.district, x.risk, loc.intervention, x.risk === "high" ? "Monthly" : "Quarterly", Math.round(x.pending * 0.22)]
      : [x.taluk, x.district, x.risk, x.risk === "high" ? "Sprint (0-6 mo)" : "Standard (6-18 mo)", Math.round(x.parcels * 0.018), i + 1]);
  });
  downloadCSV(role === "collector" ? "intervention-plan.csv" : "resurvey-priority.csv", rows);
  toast(t("toast.csv"));
});

/* ============ Research Hub ============ */
const TOPIC_KEYS = { "Urban Expansion": "topic.urban", "Climate Risk": "topic.climate", "Infrastructure": "topic.infra", "Disputes": "topic.disputes", "Agriculture": "topic.agri", "Land Records": "topic.records", "Policy Simulation": "topic.policy" };
const TYPE_KEYS = { "Journal Paper": "type.journal", "Policy Brief": "type.brief", "Government Report": "type.report", "Case Study": "type.case" };

function initResearch() {
  const states = [...new Set(RESEARCH.map((r) => r.state))];
  const years = [...new Set(RESEARCH.map((r) => r.year))].sort((a, b) => b - a);
  const topics = [...new Set(RESEARCH.map((r) => r.topic))].sort();
  const types = [...new Set(RESEARCH.map((r) => r.type))].sort();
  $("rs-state").innerHTML = `<option value="">${t("research.allStates")}</option>` + states.map((v) => `<option value="${v}">${REGIONS_TREE[v].name}</option>`).join("");
  $("rs-year").innerHTML = `<option value="">${t("research.allYears")}</option>` + years.map((v) => `<option value="${v}">${v}</option>`).join("");
  $("rs-topic").innerHTML = `<option value="">${t("research.allTopics")}</option>` + topics.map((v) => `<option value="${v}">${t(TOPIC_KEYS[v])}</option>`).join("");
  $("rs-type").innerHTML = `<option value="">${t("research.allTypes")}</option>` + types.map((v) => `<option value="${v}">${t(TYPE_KEYS[v])}</option>`).join("");
  ["rs-q", "rs-state", "rs-year", "rs-topic", "rs-type"].forEach((id) => {
    $(id).addEventListener(id === "rs-q" ? "input" : "change", renderResearch);
  });
  $("rs-clear").addEventListener("click", () => {
    $("rs-q").value = ""; ["rs-state", "rs-year", "rs-topic", "rs-type"].forEach((id) => { $(id).value = ""; });
    renderResearch();
  });
  renderResearch();
}

function researchFiltered() {
  const q = $("rs-q").value.trim().toLowerCase();
  const st = $("rs-state").value, yr = $("rs-year").value, tp = $("rs-topic").value, ty = $("rs-type").value;
  return RESEARCH.filter((r) =>
    (!q || (r.title + " " + r.summary + " " + r.topic + " " + r.location).toLowerCase().includes(q)) &&
    (!st || r.state === st) && (!yr || String(r.year) === yr) && (!tp || r.topic === tp) && (!ty || r.type === ty));
}

function renderResearch() {
  const rows = researchFiltered();
  $("rs-count").textContent = t("research.count", { n: rows.length, s: rows.length === 1 ? "" : "s" });
  $("research-empty").hidden = rows.length > 0;
  $("research-results").innerHTML = rows.map((r) => `
    <article class="research-card">
      <h3>${r.title}</h3>
      <div class="rc-meta"><span>${r.year}</span><span>${REGIONS_TREE[r.state].name}</span><span>${t(TOPIC_KEYS[r.topic])}</span><span>${t(TYPE_KEYS[r.type])}</span></div>
      <p class="rc-summary">${r.summary.slice(0, 150)}…</p>
      <button class="btn btn-ghost" data-open="${r.id}">${t("research.open")}</button>
    </article>`).join("");
}

$("research-results").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-open]");
  if (b) showResearchDetails(b.dataset.open);
});

function showResearchDetails(id) {
  const r = RESEARCH.find((x) => x.id === id);
  if (!r) return;
  openModal(r.title, `
    <p class="fineprint" style="margin-bottom:10px">${r.source} · ${r.year} · ${r.location} · <span class="risk-badge risk-low">${t("flag.demoDataset")}</span></p>
    <h4>${t("research.aiSummary")}</h4>
    <p>${r.summary}</p>
    <h4>${t("research.datasets")}</h4><ul>${r.datasets.map((d) => `<li>${d}</li>`).join("")}</ul>
    <h4>${t("research.layers")}</h4><ul>${r.layers.map((l) => `<li>${l}</li>`).join("")}</ul>
    <h4>${t("research.related")}</h4>
    <ul>${RESEARCH.filter((x) => x.topic === r.topic && x.id !== r.id).slice(0, 3).map((x) => `<li><a href="#" data-research="${x.id}">${x.title}</a> (${x.year})</li>`).join("") || `<li>${t("research.noneRelated")}</li>`}</ul>
    <p class="fineprint">${t("research.citeNote")}</p>`);
}
document.addEventListener("click", (e) => {
  const link = e.target.closest("#modal-body a[data-research]");
  if (link) { e.preventDefault(); showResearchDetails(link.dataset.research); }
});

/* ============ Ask BhumiMitra AI ============ */
function renderChips() {
  $("rag-chips").innerHTML = RAG_TOPICS.map((tp) =>
    `<button class="chip" data-topic="${tp.id}">${t("chip." + tp.id)}</button>`).join("");
}
$("rag-chips").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-topic]");
  if (b) {
    const topic = RAG_TOPICS.find((x) => x.id === b.dataset.topic);
    $("rag-input").value = topic.question;
    runRag(topic, true);
  }
});

function matchTopic(q) {
  const s = q.toLowerCase();
  let best = null, bestScore = 0;
  for (const tp of RAG_TOPICS) {
    let score = 0;
    for (const k of tp.keywords) if (s.includes(k)) score += k.length;
    for (const w of tp.question.toLowerCase().split(/\W+/)) if (w.length > 4 && s.includes(w)) score += 1;
    if (score > bestScore) { bestScore = score; best = tp; }
  }
  return bestScore > 0 ? best : null;
}

let lastRag = null;
function runRag(topic, fromChip) {
  const q = topic && fromChip ? t("chip." + topic.id) : $("rag-input").value.trim();
  lastRag = { topic, fromChip };
  const body = topic || { ...RAG_FALLBACK };
  $("rag-empty").hidden = true;
  $("rag-answer").hidden = false;
  $("rag-q").textContent = "Q · " + q;
  $("rag-thinking").hidden = false;
  $("rag-body").hidden = true;
  setTimeout(() => renderRagBody(body), 900);
}

function renderRagBody(body) {
  const loc = body.id && RAG_I18N[body.id] ? (RAG_I18N[body.id][LANG] || null) : null;
  const answer = loc ? loc.answer : body.answer;
  const insights = loc ? loc.insights : body.insights;
  const next = loc ? loc.next : body.next;
  $("rag-text").textContent = answer;
  const fill = (id, arr) => { $(id).innerHTML = arr.map((x) => `<li>${x}</li>`).join(""); };
  fill("rag-insights", insights);
  fill("rag-next", next);
  fill("rag-datasets", body.datasets);
  fill("rag-research", body.research);
  fill("rag-policy", body.policy);
  fill("rag-layers", body.layers);
  $("rag-thinking").hidden = true;
  $("rag-body").hidden = false;
}

$("rag-search-btn").addEventListener("click", () => {
  const q = $("rag-input").value.trim();
  if (!q) { $("rag-input").focus(); return; }
  runRag(matchTopic(q), false);
});
$("rag-input").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("rag-search-btn").click(); } });

/* ============ Report Generator ============ */
let lastReportVisible = false;
function initReports() {
  $("rp-region").innerHTML = Object.entries(REGIONS_TREE).map(([c, tr]) =>
    `<option value="${c}">${tr.name} — ${Object.keys(tr.districts)[0]}</option>`).join("");
  $("rp-research").innerHTML = RESEARCH.map((r) => `<option value="${r.id}">${r.title} (${r.year})</option>`).join("");
  $("rp-generate").addEventListener("click", () => generateReport(false));
  $("rp-download").addEventListener("click", () => {
    downloadFile("bhumimitra-demo-report.html", "<!DOCTYPE html><html><head><meta charset='utf-8'><title>BhumiMitra Demo Report</title></head><body>" + $("report-preview").innerHTML + "</body></html>", "text/html;charset=utf-8");
    toast(t("toast.reportDl"));
  });
  $("rp-print").addEventListener("click", () => window.print());
}

function generateReport(silent) {
  const rc = $("rp-region").value;
  const st = STATES[rc];
  const scenarioSel = $("rp-scenario");
  const scenarioKey = { "agri-industrial": "rp.scen.industrial", "agri-protect": "rp.scen.protect", "agri-solar": "rp.scen.solar" }[scenarioSel.value];
  const scenarioText = t(scenarioKey);
  const changeKey = scenarioSel.value;
  const area = changeKey === "agri-solar" ? 300 : 500;
  const horizon = changeKey === "agri-solar" ? 10 : 5;
  const research = RESEARCH.find((r) => r.id === $("rp-research").value);
  const district = Object.keys(REGIONS_TREE[rc].districts)[0];
  const region = REGIONS_TREE[rc].districts[district][0];
  const m = regionMetrics(rc, region);
  const im = computeScenario(rc, changeKey, area, "conversion", horizon);
  const findings = [];
  if ($("rp-f-climate").checked) findings.push(t("rpt.gisClimate", { region, v: m.climateRisk, w: m.waterStress }));
  if ($("rp-f-urban").checked) findings.push(t("rpt.gisUrban", { region, v: m.urbanGrowth }));
  if ($("rp-f-disputes").checked) findings.push(t("rpt.gisDisputes", { region, v: m.disputes }));
  if (!findings.length) findings.push(t("rpt.gisNone"));

  const date = new Date().toLocaleDateString(LANG === "en" ? "en-IN" : LANG === "mr" ? "mr-IN" : "hi-IN", { year: "numeric", month: "long", day: "numeric" });
  $("report-preview").innerHTML = `
    <span class="rp-stamp">${t("rpt.stamp")}</span>
    <h1>${t("rpt.title", { state: st.name })}</h1>
    <p class="fineprint">${t("rpt.generated", { date })}</p>
    <h2>${t("rpt.exec")}</h2>
    <p>${t("rpt.execBody", { scenario: scenarioText, district, state: st.name, agri: fmtInt(im.agriLoss), jobs: fmtInt(im.jobs), infra: fmtInt(im.infraInvest), horizon, water: im.waterDelta, disputes: fmtInt(im.disputes) })}</p>
    <h2>${t("rpt.land")}</h2>
    <div class="rp-kv">
      <span>${t("rpt.landAgri")} <b>${st.landUse.agri[2]}%</b></span>
      <span>${t("rpt.landUrban")} <b>${st.landUse.urban[2]}%</b></span>
      <span>${t("rpt.landRegion")} <b>${region}, ${district}</b></span>
      <span>${t("rpt.landRegionAgri")} <b>${m.agri}%</b></span>
      <span>${t("rpt.landPop")} <b>${fmtInt(m.population)}</b></span>
      <span>${t("rpt.landInfra")} <b>${m.infra}/100</b></span>
    </div>
    <h2>${t("rpt.evidence")}</h2>
    <p><b>${research.title}</b> (${research.year}, ${research.source}): ${research.summary}</p>
    <h2>${t("rpt.gis")}</h2>
    <ul>${findings.map((f) => `<li>${f}</li>`).join("")}</ul>
    <h2>${t("rpt.climate")}</h2>
    <p>${t("rpt.climateBody", { drought: st.climate.drought, heat: st.climate.heat, flood: st.climate.flood, water: st.climate.waterStress, delta: (im.climateIdx > 0 ? "+" : "") + im.climateIdx })}</p>
    <h2>${t("rpt.scenario")}</h2>
    <p>${t("rpt.scenarioBody", { scenario: scenarioText, horizon, region, district })}</p>
    <h2>${t("rpt.results")}</h2>
    <div class="rp-kv">
      <span>${t("rpt.resAgri")} <b>${fmtInt(im.agriLoss)} ha</b></span>
      <span>${t("rpt.resHouseholds")} <b>${fmtInt(im.households)}</b></span>
      <span>${t("rpt.resJobs")} <b>${fmtInt(im.jobs)}</b></span>
      <span>${t("rpt.resInfra")} <b>₹${fmtInt(im.infraInvest)} Cr</b></span>
      <span>${t("rpt.resGva")} <b>₹${im.gva.toFixed(1)} Cr</b></span>
      <span>${t("rpt.resWater")} <b>${im.waterDelta > 0 ? "+" : ""}${im.waterDelta}%</b></span>
      <span>${t("rpt.resEnv")} <b>${im.envScore > 0 ? "+" : ""}${im.envScore.toFixed(1)}</b></span>
      <span>${t("rpt.resDisputes")} <b>${fmtInt(im.disputes)}</b></span>
    </div>
    <h2>${t("rpt.recs")}</h2>
    <ul>
      <li>${t("rpt.rec1")}</li>
      <li>${t("rpt.rec2")}</li>
      <li>${t("rpt.rec3")}</li>
      <li>${t("rpt.rec4")}</li>
    </ul>
    <p class="fineprint">${t("rpt.footer")}</p>`;
  lastReportVisible = true;
  $("report-output").hidden = false;
  if (!silent) {
    $("report-output").scrollIntoView({ behavior: "smooth", block: "start" });
    toast(t("toast.report"));
  }
}

/* ============ Reset Demo ============ */
function resetDemo() {
  $("state-select").value = "ALL"; $("layer-select").value = "landuse"; $("map-search").value = "";
  $("compare-box").hidden = true;
  if (maps.national) { maps.national.setView([20.6, 78.4], 5); renderNationalMap(); }
  gisState = "MH"; gisDistrict = "Pune"; gisRegion = "Haveli";
  if (maps.gis) { $("gis-state").value = "MH"; fillGisCascade(); renderGisLayers(false); }
  ["lyr-climate", "lyr-urban", "lyr-disputes", "lyr-infra", "lyr-water"].forEach((id) => { $(id).checked = false; });
  $("lyr-landuse").checked = true;
  twinState = "MH"; twinDistrict = "Pune"; twinRegion = "Wagholi";
  $("twin-state").value = "MH"; fillTwinCascade(); renderRegionTwin();
  $("parcel-search").value = ""; $("parcel-error").hidden = true;
  $("twin-detail").hidden = true; $("twin-empty").hidden = false; currentParcel = null;
  sandboxRuns.length = 0; lastSandboxRun = null; lastPreset = null;
  $("sandbox-result").hidden = true; $("sandbox-loading").hidden = true; $("preset-compare").hidden = true;
  $("sandbox-form").reset(); $("sb-horizon").value = "10";
  $("sl-ceiling").value = 0; $("sl-stamp").value = 6; $("sl-tenancy").value = 50;
  renderSim();
  radarHighOnly = false; $("radar-filter-high").textContent = t("radar.filterHigh"); renderRadarTable();
  $("rag-input").value = ""; $("rag-answer").hidden = true; $("rag-empty").hidden = false; lastRag = null;
  $("rs-q").value = ""; ["rs-state", "rs-year", "rs-topic", "rs-type"].forEach((id) => { $(id).value = ""; });
  renderResearch();
  lastReportVisible = false;
  $("report-output").hidden = true;
  $("role-select").value = "researcher"; applyRole();
  activateTab("dashboard");
  toast(t("toast.reset"));
}

/* ============ i18n re-render hooks ============ */
I18N_RERENDER.push(() => {
  renderMetrics();
  renderNationalMap();
  if (lastStateCode) { renderStateResearch(lastStateCode); renderStatePolicy(lastStateCode); renderClimate(lastStateCode); renderLandUse(lastStateCode); }
  if (!$("compare-box").hidden) renderCompareBox();
  renderGisLegend(); renderGisInfo(); renderGisLayers(false);
  renderRegionTwin();
  if (currentParcel && !$("twin-detail").hidden) openParcel(currentParcel.code);
  renderRadar(); renderRadarTable();
  $("radar-filter-high").textContent = radarHighOnly ? t("radar.filterAll") : t("radar.filterHigh");
  initResearchOptionsKeep();
  renderResearch();
  renderChips();
  if (lastRag && !$("rag-answer").hidden) {
    $("rag-q").textContent = "Q · " + (lastRag.fromChip && lastRag.topic ? t("chip." + lastRag.topic.id) : $("rag-input").value.trim());
    renderRagBody(lastRag.topic || { ...RAG_FALLBACK });
  }
  renderSim();
  if (lastSandboxRun && !$("sandbox-result").hidden) renderSandbox();
  if (lastPreset && !$("preset-compare").hidden) renderPresetCompare();
  if (lastReportVisible) generateReport(true);
  applyRole();
});

function initResearchOptionsKeep() {
  const keep = { st: $("rs-state").value, yr: $("rs-year").value, tp: $("rs-topic").value, ty: $("rs-type").value };
  const states = [...new Set(RESEARCH.map((r) => r.state))];
  const years = [...new Set(RESEARCH.map((r) => r.year))].sort((a, b) => b - a);
  const topics = [...new Set(RESEARCH.map((r) => r.topic))].sort();
  const types = [...new Set(RESEARCH.map((r) => r.type))].sort();
  $("rs-state").innerHTML = `<option value="">${t("research.allStates")}</option>` + states.map((v) => `<option value="${v}" ${v === keep.st ? "selected" : ""}>${REGIONS_TREE[v].name}</option>`).join("");
  $("rs-year").innerHTML = `<option value="">${t("research.allYears")}</option>` + years.map((v) => `<option value="${v}" ${String(v) === keep.yr ? "selected" : ""}>${v}</option>`).join("");
  $("rs-topic").innerHTML = `<option value="">${t("research.allTopics")}</option>` + topics.map((v) => `<option value="${v}" ${v === keep.tp ? "selected" : ""}>${t(TOPIC_KEYS[v])}</option>`).join("");
  $("rs-type").innerHTML = `<option value="">${t("research.allTypes")}</option>` + types.map((v) => `<option value="${v}" ${v === keep.ty ? "selected" : ""}>${t(TYPE_KEYS[v])}</option>`).join("");
}

/* ============ App init (once, after gate) ============ */
let appInited = false;
function ensureAppInit() {
  if (appInited) return;
  appInited = true;
  try {
    bootApp();
  } catch (err) {
    window.__initErr = err;
    appInited = false;
    throw err;
  }
}
function bootApp() {
  maps.national = L.map("national-map", { center: [20.6, 78.4], zoom: 5, minZoom: 4 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 12, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(maps.national);

  renderMetrics();
  renderNationalMap();
  selectState("MH", true);
  initGis();
  initTwinCascade();
  renderQuickChips();
  renderRadar();
  renderRadarTable();
  initResearch();
  renderChips();
  initReports();
  renderSim();
  applyRole();
  activateTab("dashboard");
}

/* Boot */
initLang();
applyStaticI18n();
updateLangSwitcher();
if (localStorage.getItem(SESSION_KEY) === "1") enterDemo(true);
else showGate();
