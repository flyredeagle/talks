const pptxgen = require("pptxgenjs");

// ═══════════════════════════════════════════════════════════
// DESIGN CONSTANTS — matching the example L01_merged style
// ═══════════════════════════════════════════════════════════
const C = {
  // Backgrounds
  darkBg:    "0D1B2A",   // deep navy — title slides
  darkBg2:   "111D2E",   // slightly lighter navy
  panelBg:   "162236",   // panel background
  lightBg:   "FFFFFF",   // content slides
  offWhite:  "F0F4F8",   // secondary panels

  // Text
  white:     "FFFFFF",
  lightText: "B0C4DE",
  mutedText: "7B8FA6",
  darkText:  "1A2332",
  bodyText:  "1E2D3D",

  // Tier badge colours
  hs:        "F4C430",   // gold
  beg:       "4CAF7D",   // green
  adv:       "5B9BD5",   // blue
  msc:       "9B72CF",   // purple
  phd:       "E07B6A",   // coral/red

  // Accent colours
  accentCyan: "00B4D8",
  accentTeal: "00897B",
  accentGold: "F4A261",
  accentGreen:"2ECC71",

  // Section header colours in content panels
  panelHeader: "00B4D8",
  panelBorder: "1E3A5F",

  // Formula box
  formulaBg:  "0A1628",
  formulaBdr: "00B4D8",
};

// Tier definitions
const TIERS = [
  { code: "HS",    label: "High School",   color: C.hs },
  { code: "BegUG", label: "Beg. UG",       color: C.beg },
  { code: "AdvUG", label: "Adv. UG",       color: C.adv },
  { code: "MSc",   label: "MSc",           color: C.msc },
  { code: "PhD",   label: "PhD",           color: C.phd },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function addFooter(slide, lectureCode, tabLabel, bgDark = false) {
  const textCol = bgDark ? "4A6080" : "9AAABB";
  // Left footer
  slide.addText(`QM: Module I.1 — ${lectureCode}`, {
    x: 0.3, y: 5.35, w: 5, h: 0.25,
    fontSize: 8, color: textCol, fontFace: "Calibri"
  });
  // Right footer / tab label
  slide.addText(tabLabel, {
    x: 7.5, y: 5.35, w: 2.2, h: 0.25,
    fontSize: 8, color: textCol, fontFace: "Calibri", align: "right"
  });
}

function addSlideTag(slide, lectureCode, bgDark = true) {
  const fillCol = bgDark ? "1E3A5F" : "E8F0F8";
  const textCol = bgDark ? "5B9BD5" : "3A6EA5";
  slide.addShape("rect", {
    x: 9.4, y: 0.05, w: 0.55, h: 0.30,
    fill: { color: fillCol }, line: { color: fillCol }
  });
  slide.addText(lectureCode, {
    x: 9.4, y: 0.05, w: 0.55, h: 0.30,
    fontSize: 8, bold: true, color: textCol,
    fontFace: "Calibri", align: "center", valign: "middle"
  });
}

function addTierBadge(slide, tier, x, y) {
  slide.addShape("roundRect", {
    x, y, w: 0.75, h: 0.27,
    fill: { color: tier.color },
    line: { color: tier.color },
    rectRadius: 0.05
  });
  slide.addText(tier.code, {
    x, y, w: 0.75, h: 0.27,
    fontSize: 9, bold: true, color: C.darkText,
    fontFace: "Calibri", align: "center", valign: "middle"
  });
}

function addPanel(slide, title, bodyLines, x, y, w, h, {
  titleColor = C.panelHeader,
  bgColor = C.panelBg,
  borderColor = C.panelBorder,
  textColor = C.lightText,
  fontSize = 10
} = {}) {
  // Panel background
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: bgColor },
    line: { color: borderColor, width: 1.5 }
  });
  // Title
  slide.addText(title, {
    x: x + 0.12, y: y + 0.1, w: w - 0.24, h: 0.25,
    fontSize: 9, bold: true, color: titleColor,
    fontFace: "Calibri", charSpacing: 1
  });
  // Body
  if (bodyLines && bodyLines.length > 0) {
    const items = bodyLines.map((line, i) => ({
      text: line,
      options: {
        bullet: line.startsWith("•") ? false : true,
        breakLine: i < bodyLines.length - 1,
        color: textColor,
        fontSize,
        fontFace: "Calibri"
      }
    }));
    // Remove bullet if line starts with •
    const cleanItems = bodyLines.map((line, i) => ({
      text: line.replace(/^•\s*/, ""),
      options: {
        bullet: !line.startsWith("•") && !line.startsWith("─") && !line.startsWith("["),
        breakLine: i < bodyLines.length - 1,
        color: line.startsWith("─") ? C.mutedText : textColor,
        fontSize: line.startsWith("─") ? fontSize - 1 : fontSize,
        fontFace: "Calibri",
        italic: line.startsWith("─")
      }
    }));
    slide.addText(cleanItems, {
      x: x + 0.15, y: y + 0.38, w: w - 0.3, h: h - 0.5,
      valign: "top"
    });
  }
}

function addLightPanel(slide, title, bodyLines, x, y, w, h, accentColor = C.accentCyan) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.offWhite },
    line: { color: "D0DCE8", width: 1 }
  });
  // Left accent bar
  slide.addShape("rect", {
    x, y, w: 0.05, h,
    fill: { color: accentColor },
    line: { color: accentColor }
  });
  slide.addText(title, {
    x: x + 0.18, y: y + 0.08, w: w - 0.25, h: 0.24,
    fontSize: 9.5, bold: true, color: accentColor,
    fontFace: "Calibri", charSpacing: 1
  });
  if (bodyLines && bodyLines.length > 0) {
    const items = bodyLines.map((line, i) => ({
      text: line.replace(/^•\s*/, ""),
      options: {
        bullet: !line.startsWith("•") && !line.startsWith("─") && !line.startsWith("["),
        breakLine: i < bodyLines.length - 1,
        color: line.startsWith("─") ? "999999" : C.bodyText,
        fontSize: line.startsWith("─") ? 8.5 : 10,
        fontFace: "Calibri"
      }
    }));
    slide.addText(items, {
      x: x + 0.2, y: y + 0.36, w: w - 0.3, h: h - 0.45,
      valign: "top"
    });
  }
}

// ═══════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════

function buildTitleSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Right-side decorative circle with Ψ symbol
  slide.addShape("ellipse", {
    x: 7.3, y: -1.0, w: 4.5, h: 4.5,
    fill: { color: "1B3055", transparency: 40 },
    line: { color: "1B3055" }
  });
  slide.addText("Ψ", {
    x: 7.8, y: -0.2, w: 3.5, h: 3.5,
    fontSize: 120, color: "1E3A6E", bold: true,
    fontFace: "Cambria", align: "center", valign: "middle"
  });

  // Module label
  slide.addText(`QUANTUM MECHANICS  —  MODULE I.1  —  HILBERT SPACE & OPERATORS`, {
    x: 0.5, y: 0.9, w: 7, h: 0.3,
    fontSize: 8, color: C.mutedText, fontFace: "Calibri",
    charSpacing: 3, bold: false
  });

  // Lecture code badge
  slide.addText(lecture.code, {
    x: 0.5, y: 1.3, w: 1.0, h: 0.45,
    fontSize: 22, color: C.accentCyan, bold: true, fontFace: "Cambria"
  });

  // Lecture title
  slide.addText(lecture.title, {
    x: 0.5, y: 1.85, w: 6.8, h: 1.5,
    fontSize: 32, bold: true, color: C.white,
    fontFace: "Cambria", valign: "top"
  });

  // Subtitle track
  slide.addText(lecture.subtitle, {
    x: 0.5, y: 3.5, w: 6.5, h: 0.35,
    fontSize: 13, color: C.accentCyan, fontFace: "Calibri", italic: true
  });

  // Tier badges
  let bx = 0.5;
  TIERS.forEach(tier => {
    addTierBadge(slide, tier, bx, 4.0);
    bx += 0.85;
  });

  // Caption
  slide.addText("Full expanded deck  ·  5 tiers  ·  Worked examples  ·  Complete problem sets", {
    x: 0.5, y: 4.45, w: 7, h: 0.25,
    fontSize: 9, color: C.mutedText, fontFace: "Calibri"
  });

  addFooter(slide, lecture.code, lecture.code, true);
}

function buildOverviewSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addSlideTag(slide, lecture.code, false);

  // Title bar
  slide.addText(`${lecture.code} — Lecture Overview`, {
    x: 0.3, y: 0.15, w: 9.0, h: 0.42,
    fontSize: 22, bold: true, color: C.darkText, fontFace: "Cambria"
  });
  slide.addText(lecture.title, {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 11, color: "5B7A9D", fontFace: "Calibri", italic: true
  });

  // Pacing panel (top-left)
  addLightPanel(slide, "90-MIN PACING", lecture.pacing, 0.25, 0.95, 4.6, 1.85, C.accentCyan);

  // Learning outcomes panel (top-right)
  addLightPanel(slide, "CORE LEARNING OUTCOMES", lecture.outcomes, 4.95, 0.95, 4.75, 1.85, C.accentGreen);

  // Tier differentiation row
  const tierY = 2.88;
  const tierW = 1.82;
  const tierColors = [C.hs, C.beg, C.adv, C.msc, C.phd];
  TIERS.forEach((tier, i) => {
    const tx = 0.25 + i * (tierW + 0.07);
    slide.addShape("rect", {
      x: tx, y: tierY, w: tierW, h: 1.45,
      fill: { color: C.offWhite },
      line: { color: "D0DCE8", width: 1 }
    });
    slide.addShape("rect", {
      x: tx, y: tierY, w: tierW, h: 0.28,
      fill: { color: tier.color },
      line: { color: tier.color }
    });
    slide.addText(tier.code, {
      x: tx, y: tierY, w: tierW, h: 0.28,
      fontSize: 9, bold: true, color: C.darkText,
      fontFace: "Calibri", align: "center", valign: "middle"
    });
    slide.addText(lecture.tierSummary[i], {
      x: tx + 0.1, y: tierY + 0.32, w: tierW - 0.2, h: 1.08,
      fontSize: 8.5, color: C.bodyText, fontFace: "Calibri", valign: "top"
    });
  });

  // Assessment panel
  addLightPanel(slide, "ASSESSMENT BUNDLE", lecture.assessment, 0.25, 4.4, 9.45, 0.9, C.accentGold);

  addFooter(slide, lecture.code, `${lecture.code} · Overview`);
}

function buildDualTrackSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addSlideTag(slide, lecture.code, false);

  slide.addText(`${lecture.code} — Dual-Track Content`, {
    x: 0.3, y: 0.15, w: 9.0, h: 0.42,
    fontSize: 22, bold: true, color: C.darkText, fontFace: "Cambria"
  });
  slide.addText("Two parallel perspectives: Geometric/Physical  ↔  Algebraic/Axiomatic", {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 11, color: "5B7A9D", fontFace: "Calibri", italic: true
  });

  // Track A (left)
  const trackA = lecture.trackA;
  slide.addShape("rect", {
    x: 0.25, y: 0.92, w: 4.65, h: 4.35,
    fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 }
  });
  slide.addShape("rect", {
    x: 0.25, y: 0.92, w: 4.65, h: 0.32,
    fill: { color: C.accentCyan }, line: { color: C.accentCyan }
  });
  slide.addText(trackA.title, {
    x: 0.35, y: 0.92, w: 4.45, h: 0.32,
    fontSize: 10, bold: true, color: C.darkText,
    fontFace: "Calibri", align: "center", valign: "middle", charSpacing: 1
  });

  trackA.sections.forEach((sec, i) => {
    const sy = 1.3 + i * 0.95;
    slide.addText(sec.title, {
      x: 0.4, y: sy, w: 4.35, h: 0.22,
      fontSize: 9.5, bold: true, color: C.accentCyan, fontFace: "Calibri"
    });
    slide.addText(sec.body, {
      x: 0.4, y: sy + 0.23, w: 4.35, h: 0.65,
      fontSize: 9, color: C.bodyText, fontFace: "Calibri", valign: "top"
    });
  });

  // Track B (right)
  const trackB = lecture.trackB;
  slide.addShape("rect", {
    x: 5.1, y: 0.92, w: 4.65, h: 4.35,
    fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 }
  });
  slide.addShape("rect", {
    x: 5.1, y: 0.92, w: 4.65, h: 0.32,
    fill: { color: C.accentTeal }, line: { color: C.accentTeal }
  });
  slide.addText(trackB.title, {
    x: 5.2, y: 0.92, w: 4.45, h: 0.32,
    fontSize: 10, bold: true, color: C.white,
    fontFace: "Calibri", align: "center", valign: "middle", charSpacing: 1
  });

  trackB.sections.forEach((sec, i) => {
    const sy = 1.3 + i * 0.95;
    slide.addText(sec.title, {
      x: 5.2, y: sy, w: 4.45, h: 0.22,
      fontSize: 9.5, bold: true, color: C.accentTeal, fontFace: "Calibri"
    });
    slide.addText(sec.body, {
      x: 5.2, y: sy + 0.23, w: 4.45, h: 0.65,
      fontSize: 9, color: C.bodyText, fontFace: "Calibri", valign: "top"
    });
  });

  addFooter(slide, lecture.code, `${lecture.code} · Dual Track`);
}

function buildContentSlide(pres, lecture, section) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addSlideTag(slide, lecture.code, false);

  // Title
  slide.addText(`${lecture.code} — ${section.sectionCode}: ${section.title}`, {
    x: 0.3, y: 0.15, w: 9.1, h: 0.42,
    fontSize: 19, bold: true, color: C.darkText, fontFace: "Cambria"
  });
  slide.addText(section.subtitle, {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 10.5, color: "5B7A9D", fontFace: "Calibri", italic: true
  });

  // Main content box (left)
  slide.addShape("rect", {
    x: 0.25, y: 0.9, w: 5.7, h: 4.4,
    fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 }
  });
  slide.addShape("rect", {
    x: 0.25, y: 0.9, w: 0.05, h: 4.4,
    fill: { color: C.accentCyan }, line: { color: C.accentCyan }
  });

  // Content sections inside main box
  let cy = 0.98;
  section.content.forEach(block => {
    slide.addText(block.heading, {
      x: 0.45, y: cy, w: 5.35, h: 0.24,
      fontSize: 9.5, bold: true, color: C.accentCyan, fontFace: "Calibri"
    });
    cy += 0.26;
    slide.addText(block.body, {
      x: 0.45, y: cy, w: 5.35, h: block.height || 0.6,
      fontSize: 9, color: C.bodyText, fontFace: "Calibri", valign: "top"
    });
    cy += (block.height || 0.6) + 0.12;
  });

  // Right panels (key formula + worked example)
  addLightPanel(slide, "KEY FORMULA", section.formula, 6.1, 0.9, 3.6, 1.6, C.accentGold);
  addLightPanel(slide, "WORKED EXAMPLE", section.example, 6.1, 2.6, 3.6, 2.7, C.accentGreen);

  addFooter(slide, lecture.code, `${lecture.code} · ${section.sectionCode}`);
}

function buildTierSlide(pres, lecture, tier, content) {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };
  addSlideTag(slide, lecture.code, true);

  // Tier badge header
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: C.darkBg2 }, line: { color: C.darkBg2 }
  });
  slide.addShape("roundRect", {
    x: 0.3, y: 0.15, w: 0.9, h: 0.42,
    fill: { color: tier.color }, line: { color: tier.color }, rectRadius: 0.05
  });
  slide.addText(tier.code, {
    x: 0.3, y: 0.15, w: 0.9, h: 0.42,
    fontSize: 13, bold: true, color: C.darkText,
    fontFace: "Calibri", align: "center", valign: "middle"
  });
  slide.addText(`${lecture.code} — ${tier.label} Track`, {
    x: 1.35, y: 0.15, w: 6, h: 0.42,
    fontSize: 14, bold: true, color: C.white, fontFace: "Cambria", valign: "middle"
  });
  slide.addText(lecture.title, {
    x: 1.35, y: 0.53, w: 8.3, h: 0.2,
    fontSize: 9, color: C.mutedText, fontFace: "Calibri", italic: true
  });

  // Learning objectives panel
  addPanel(slide, "LEARNING OBJECTIVES", content.objectives,
    0.25, 0.82, 4.7, 2.0,
    { titleColor: tier.color, bgColor: C.panelBg, borderColor: C.panelBorder,
      textColor: C.lightText, fontSize: 9.5 });

  // Worked example panel
  addPanel(slide, "WORKED EXAMPLE", content.example,
    0.25, 2.9, 4.7, 2.35,
    { titleColor: C.accentGold, bgColor: "0A1628", borderColor: "1E3A5F",
      textColor: "B8D0E8", fontSize: 9 });

  // Problem set panel
  addPanel(slide, "PROBLEM SET", content.problems,
    5.1, 0.82, 4.65, 2.0,
    { titleColor: C.accentGreen, bgColor: C.panelBg, borderColor: C.panelBorder,
      textColor: C.lightText, fontSize: 9.5 });

  // Extension / deeper content panel
  addPanel(slide, "EXTENSIONS & DEPTH", content.extensions,
    5.1, 2.9, 4.65, 2.35,
    { titleColor: C.accentCyan, bgColor: "0A1628", borderColor: "1E3A5F",
      textColor: "B8D0E8", fontSize: 9 });

  addFooter(slide, lecture.code, `${lecture.code} · ${tier.code}`, true);
}

function buildPitfallsSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };
  addSlideTag(slide, lecture.code, true);

  slide.addText(`${lecture.code} — Common Pitfalls & Misconceptions`, {
    x: 0.3, y: 0.15, w: 9.0, h: 0.42,
    fontSize: 20, bold: true, color: C.white, fontFace: "Cambria"
  });
  slide.addText("Consolidated pitfalls across all tiers", {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 10, color: C.mutedText, fontFace: "Calibri", italic: true
  });

  // Two pitfall panels
  addPanel(slide, "⚠  PITFALLS (A)", lecture.pitfalls.a,
    0.25, 0.92, 4.65, 1.85, { titleColor: C.accentGold });
  addPanel(slide, "⚠  PITFALLS (B)", lecture.pitfalls.b,
    5.1, 0.92, 4.65, 1.85, { titleColor: C.accentGold });

  // Historical anchors
  addPanel(slide, "HISTORICAL ANCHORS", lecture.pitfalls.history,
    0.25, 2.85, 4.65, 1.45, { titleColor: C.accentCyan });

  // Formula quick reference
  addPanel(slide, "FORMULA QUICK REFERENCE", lecture.pitfalls.formulas,
    5.1, 2.85, 4.65, 1.45, { titleColor: C.accentGreen });

  // Forward connections
  addPanel(slide, "FORWARD CONNECTIONS", lecture.pitfalls.connections,
    0.25, 4.38, 9.5, 0.85, { titleColor: C.msc });

  addFooter(slide, lecture.code, `${lecture.code} · Pitfalls`, true);
}

function buildAssessmentSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };
  addSlideTag(slide, lecture.code, true);

  slide.addText(`${lecture.code} — Assessment & Homework Summary`, {
    x: 0.3, y: 0.15, w: 9.0, h: 0.42,
    fontSize: 20, bold: true, color: C.white, fontFace: "Cambria"
  });
  slide.addText("Assessment artifact bundle — all tiers", {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 10, color: C.mutedText, fontFace: "Calibri", italic: true
  });

  // 5 tier assessment columns
  const tierW = 1.84;
  TIERS.forEach((tier, i) => {
    const tx = 0.25 + i * (tierW + 0.05);
    slide.addShape("rect", {
      x: tx, y: 0.9, w: tierW, h: 3.9,
      fill: { color: C.panelBg }, line: { color: C.panelBorder, width: 1 }
    });
    slide.addShape("rect", {
      x: tx, y: 0.9, w: tierW, h: 0.28,
      fill: { color: tier.color }, line: { color: tier.color }
    });
    slide.addText(tier.code, {
      x: tx, y: 0.9, w: tierW, h: 0.28,
      fontSize: 9, bold: true, color: C.darkText,
      fontFace: "Calibri", align: "center", valign: "middle"
    });
    const aContent = lecture.assessmentTiers[i];
    slide.addText(aContent.join("\n"), {
      x: tx + 0.08, y: 1.22, w: tierW - 0.16, h: 3.52,
      fontSize: 8, color: C.lightText, fontFace: "Calibri", valign: "top"
    });
  });

  // Homework box at bottom
  addPanel(slide, "HOMEWORK ASSIGNMENT", [
    "REQUIRED (all students): Problems from your track's Set A",
    "HONOURS (optional): Set B problems from your track",
    "PROJECT: Choose simple OR advanced track from your tier",
    "RESEARCH: At least one well-defined question; open questions for MSc/PhD"
  ], 0.25, 4.9, 9.5, 0.65, { titleColor: C.accentCyan, fontSize: 9 });

  addFooter(slide, lecture.code, `${lecture.code} · Assessment`, true);
}

function buildReferencesSlide(pres, lecture) {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };
  addSlideTag(slide, lecture.code, true);

  slide.addText(`${lecture.code} — References & Bibliography`, {
    x: 0.3, y: 0.15, w: 9.0, h: 0.42,
    fontSize: 20, bold: true, color: C.white, fontFace: "Cambria"
  });
  slide.addText("Historical, educational, and research-level reading", {
    x: 0.3, y: 0.6, w: 9.0, h: 0.25,
    fontSize: 10, color: C.mutedText, fontFace: "Calibri", italic: true
  });

  // Three reference columns
  addPanel(slide, "PRIMARY TEXTBOOKS", lecture.refs.primary, 0.25, 0.92, 3.0, 4.35,
    { titleColor: C.accentCyan, fontSize: 9 });
  addPanel(slide, "EDUCATIONAL REFERENCES", lecture.refs.educational, 3.4, 0.92, 3.05, 4.35,
    { titleColor: C.accentGreen, fontSize: 9 });
  addPanel(slide, "HISTORICAL & RESEARCH", lecture.refs.historical, 6.6, 0.92, 3.15, 4.35,
    { titleColor: C.accentGold, fontSize: 9 });

  addFooter(slide, lecture.code, `${lecture.code} · References`, true);
}

// ═══════════════════════════════════════════════════════════
// LECTURE DATA
// ═══════════════════════════════════════════════════════════

const lectures = [

// ─────────────────────────────────────────────────────────
// L01: The Hilbert Space of Quantum States
// ─────────────────────────────────────────────────────────
{
  code: "L01",
  title: "The Hilbert Space of Quantum States",
  subtitle: "Geometric & Algebraic Foundations — Module I.1, Lecture 1",
  pacing: [
    "0–20 min: Motivation — why Euclidean space is insufficient",
    "20–45 min: Definition of a Hilbert space H: inner product, norm, completeness",
    "45–70 min: Bounded vs. unbounded operators; operator norm; adjoint Â†",
    "70–90 min: Anti-Hermitian operators; [Â†]† = Â; worked examples"
  ],
  outcomes: [
    "State the definition of a Hilbert space and verify L²(ℝ) is one",
    "Distinguish bounded from unbounded operators with physical examples",
    "Define the adjoint Â† and compute it for 2×2 matrices",
    "Classify Hermitian (Â = Â†) and anti-Hermitian (Â = −Â†) operators"
  ],
  tierSummary: [
    "Inner product as overlap; norm as length; ℝ² and ℂ² as tangible examples",
    "Verify axioms in ℂⁿ; compute Â† for explicit matrices",
    "Prove adjoint is unique; show (ÂB̂)† = B̂†Â†",
    "L² space rigorously; operator norm; boundedness ↔ continuity equivalence",
    "Spectrum of unbounded operators; domain issues; Hellinger–Toeplitz theorem"
  ],
  assessment: [
    "Set A — verify Hilbert space axioms for ℂⁿ; compute adjoints of given 3×3 matrices",
    "Set B — prove (Â†)† = Â; show bounded ⇒ continuous",
    "Projects: norm visualiser for L² functions (simple); unbounded operator counterexample (complex)"
  ],
  trackA: {
    title: "GEOMETRIC TRACK — Infinite-Dimensional Generalisation of ℝⁿ",
    sections: [
      { title: "HILBERT SPACE AS GEOMETRY", body: "H is the right infinite-dimensional generalisation of ℝⁿ. The inner product ⟨·|·⟩ gives angles between states; completeness means no 'missing limits' in sequences of states." },
      { title: "INNER PRODUCT AND ANGLES", body: "⟨φ|ψ⟩ measures the overlap (angle) between two quantum states. Real part gives correlation; imaginary part encodes phase. Orthogonality ⟨φ|ψ⟩ = 0 means perfectly distinguishable states." },
      { title: "COMPLETENESS — NO MISSING LIMITS", body: "Every Cauchy sequence {|ψₙ⟩} with ‖|ψₙ⟩ − |ψₘ⟩‖ → 0 must converge to a state already in H. This is essential for time-evolution, Fourier expansions, and perturbation theory." },
      { title: "NORM FROM INNER PRODUCT", body: "‖|ψ⟩‖ = √⟨ψ|ψ⟩. This defines the 'length' of a state. Normalisation ⟨ψ|ψ⟩ = 1 ensures probabilities sum to unity." }
    ]
  },
  trackB: {
    title: "ALGEBRAIC/AXIOMATIC TRACK — Formal Axioms and Operator Theory",
    sections: [
      { title: "HILBERT SPACE AXIOMS", body: "H is a complex vector space with inner product ⟨·|·⟩ satisfying: (1) conjugate symmetry ⟨φ|ψ⟩ = ⟨ψ|φ⟩*; (2) linearity in second argument; (3) positive definiteness ⟨ψ|ψ⟩ ≥ 0, = 0 iff |ψ⟩ = 0; (4) completeness." },
      { title: "ADJOINT OPERATOR Â†", body: "The adjoint is defined by ⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩ for all |φ⟩, |ψ⟩ ∈ H. For matrices: (Â†)ᵢⱼ = (Â)ⱼᵢ* (conjugate transpose). Properties: (Â†)† = Â, (ÂB̂)† = B̂†Â†." },
      { title: "BOUNDED vs. UNBOUNDED OPERATORS", body: "Â is bounded if ‖Â‖ := sup{‖Â|ψ⟩‖ : ‖|ψ⟩‖ = 1} < ∞. Physical examples — bounded: spin operators Ŝᵢ; unbounded: position x̂ and momentum p̂ on L²(ℝ)." },
      { title: "HERMITIAN AND ANTI-HERMITIAN", body: "Hermitian: Â = Â† — real eigenvalues, observable. Anti-Hermitian: Â = −Â† — purely imaginary eigenvalues. Every operator decomposes: Â = (Â + Â†)/2 + (Â − Â†)/2." }
    ]
  },
  sections: [
    {
      sectionCode: "L01.1",
      title: "Motivation: Why Hilbert Space?",
      subtitle: "Failures of Euclidean space and the need for infinite dimensions",
      content: [
        { heading: "INADEQUACY OF ℝⁿ FOR QUANTUM MECHANICS", body: "Quantum states require superposition over continuous variables (position, momentum). A particle's wavefunction ψ(x) ∈ L²(ℝ) cannot be represented in any finite-dimensional space. The correct arena is an infinite-dimensional Hilbert space.", height: 0.7 },
        { heading: "PHYSICAL NECESSITY OF COMPLEX NUMBERS", body: "Interference phenomena (double-slit experiment) require complex amplitudes. Real vector spaces cannot produce the interference cross-terms |A₁ + A₂|² = |A₁|² + |A₂|² + 2 Re(A₁*A₂) with the correct sign.", height: 0.65 },
        { heading: "COMPLETENESS AS PHYSICAL REQUIREMENT", body: "Time evolution U(t)|ψ⟩ and Fourier-mode expansions require limits to exist within H. A non-complete space would have quantum states 'escaping' to outside the mathematical framework.", height: 0.6 },
        { heading: "HISTORICAL CONTEXT", body: "von Neumann (1932) placed QM on rigorous mathematical footing using Hilbert spaces. Dirac's bra-ket notation (1930) provided the physical language that maps naturally onto this framework.", height: 0.55 }
      ],
      formula: [
        "Inner product: ⟨φ|ψ⟩ ∈ ℂ",
        "Norm: ‖|ψ⟩‖ = √⟨ψ|ψ⟩",
        "Cauchy: ‖|ψₙ⟩ − |ψₘ⟩‖ → 0",
        "Completeness: limit ∈ H"
      ],
      example: [
        "L²(ℝ) as a Hilbert space:",
        "• States: ψ(x) with ∫|ψ|²dx < ∞",
        "• Inner product: ⟨φ|ψ⟩ = ∫φ*(x)ψ(x)dx",
        "• Norm: ‖ψ‖² = ∫|ψ(x)|²dx",
        "• Completeness: Riesz–Fischer theorem",
        "─ Gaussian ψ = N·exp(−x²/2σ²) ∈ L²(ℝ) ✓"
      ]
    },
    {
      sectionCode: "L01.2",
      title: "Hilbert Space Definition and Axioms",
      subtitle: "Formal structure: inner product, norm, and completeness",
      content: [
        { heading: "DEFINITION OF HILBERT SPACE", body: "A Hilbert space H is a complete inner product space over ℂ. The inner product ⟨·|·⟩: H × H → ℂ satisfies four axioms: (1) conjugate symmetry, (2) linearity in second slot, (3) positive definiteness, (4) non-degeneracy.", height: 0.65 },
        { heading: "THE FOUR INNER PRODUCT AXIOMS", body: "(IP1) ⟨φ|ψ⟩ = ⟨ψ|φ⟩*  [conjugate symmetry]\n(IP2) ⟨φ|αψ + βχ⟩ = α⟨φ|ψ⟩ + β⟨φ|χ⟩  [linearity]\n(IP3) ⟨ψ|ψ⟩ ≥ 0  [positive semidefinite]\n(IP4) ⟨ψ|ψ⟩ = 0 ⟺ |ψ⟩ = 0  [non-degeneracy]", height: 0.82 },
        { heading: "CAUCHY-SCHWARZ AND TRIANGLE INEQUALITIES", body: "|⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩·⟨ψ|ψ⟩  [Cauchy–Schwarz]\n‖|φ⟩ + |ψ⟩‖ ≤ ‖|φ⟩‖ + ‖|ψ⟩‖  [Triangle inequality]", height: 0.55 },
        { heading: "EXAMPLES AND NON-EXAMPLES", body: "Examples: ℂⁿ (finite dim.), L²(ℝ), L²([0,1]), ℓ²(ℤ). Non-Hilbert spaces: C([0,1]) with L²-norm (not complete); L²ₗₒc without the square-integrability constraint.", height: 0.6 }
      ],
      formula: [
        "⟨φ|ψ⟩* = ⟨ψ|φ⟩",
        "|⟨φ|ψ⟩|² ≤ ‖φ‖²‖ψ‖²",
        "‖|ψ⟩‖ = ⟨ψ|ψ⟩^(1/2)",
        "In ℂⁿ: ⟨φ|ψ⟩ = Σᵢ φᵢ*ψᵢ"
      ],
      example: [
        "Verify ℂ² is a Hilbert space:",
        "Let |φ⟩ = (φ₁,φ₂)ᵀ, |ψ⟩ = (ψ₁,ψ₂)ᵀ",
        "⟨φ|ψ⟩ = φ₁*ψ₁ + φ₂*ψ₂",
        "• Conjugate symmetry: ✓ by inspection",
        "• Linearity: ✓ distributivity of ℂ",
        "• ⟨ψ|ψ⟩ = |ψ₁|² + |ψ₂|² ≥ 0  ✓",
        "• Completeness: ℂⁿ is complete ✓"
      ]
    },
    {
      sectionCode: "L01.3",
      title: "Bounded and Unbounded Operators",
      subtitle: "Operator norm, domain, and physical examples",
      content: [
        { heading: "BOUNDED OPERATORS", body: "An operator Â: H → H is bounded if ‖Â‖ := sup{‖Â|ψ⟩‖/‖|ψ⟩‖ : |ψ⟩ ≠ 0} < ∞. Equivalently, Â is bounded iff it is continuous. All operators on finite-dimensional spaces are bounded.", height: 0.65 },
        { heading: "UNBOUNDED OPERATORS AND DOMAIN", body: "Unbounded operators Â: D(Â) → H are only defined on a dense subset D(Â) ⊂ H. Key examples: x̂ (position) and p̂ = −iℏ∂/∂x (momentum) on L²(ℝ). These are unbounded because x̂|ψₙ⟩ can have ‖x̂|ψₙ⟩‖ → ∞ for normalised |ψₙ⟩.", height: 0.7 },
        { heading: "THE ADJOINT OPERATOR Â†", body: "Defined via ⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩ for all |φ⟩ ∈ D(Â†) and |ψ⟩ ∈ D(Â). For matrices: (Â†)ᵢⱼ = Âⱼᵢ* (conjugate transpose). Key property: (Â†)† = Â when Â is bounded.", height: 0.65 },
        { heading: "OPERATOR CLASSIFICATIONS", body: "• Hermitian (self-adjoint): Â = Â† → real eigenvalues (observables)\n• Anti-Hermitian: Â = −Â† → imaginary eigenvalues\n• Unitary: ÂÂ† = Â†Â = 1̂ → norm-preserving\n• Normal: ÂÂ† = Â†Â → diagonalisable", height: 0.65 }
      ],
      formula: [
        "‖Â‖ = sup‖Â|ψ⟩‖/‖|ψ⟩‖",
        "⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩",
        "(Â†)ᵢⱼ = (Â)ⱼᵢ*",
        "(ÂB̂)† = B̂†Â†",
        "(Â†)† = Â"
      ],
      example: [
        "Compute Â† for spin-1/2 operator:",
        "Â = σ₊ = [[0,1],[0,0]] (raising operator)",
        "Â† = (Â*)ᵀ = [[0,0],[1,0]] = σ₋",
        "Check: ⟨φ|σ₊ψ⟩ = ⟨σ₋φ|ψ⟩ ✓",
        "─",
        "Anti-Hermitian example: iσᵧ = [[0,1],[-1,0]]",
        "(iσᵧ)† = −iσᵧ = −(iσᵧ)  ✓ anti-Hermitian"
      ]
    },
    {
      sectionCode: "L01.4",
      title: "Hermitian and Anti-Hermitian Operators",
      subtitle: "Classification, properties, and the decomposition theorem",
      content: [
        { heading: "HERMITIAN OPERATORS: Â = Â†", body: "A Hermitian operator satisfies ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ for all |φ⟩, |ψ⟩. Key properties: (1) all eigenvalues are real, (2) eigenvectors for distinct eigenvalues are orthogonal, (3) eigenvectors form a complete basis (spectral theorem).", height: 0.65 },
        { heading: "ANTI-HERMITIAN OPERATORS: Â = −Â†", body: "An anti-Hermitian operator satisfies Â† = −Â. Properties: (1) all eigenvalues are purely imaginary (λ = iμ, μ ∈ ℝ), (2) iÂ is Hermitian. Physical role: generators of unitary transformations are anti-Hermitian; observables = i × generators.", height: 0.65 },
        { heading: "PROOF: (Â†)† = Â", body: "By definition of adjoint: ⟨φ|(Â†)†ψ⟩ = ⟨(Â†)φ|ψ⟩ for all |φ⟩, |ψ⟩.\nBut ⟨(Â†)φ|ψ⟩ = ⟨ψ|(Â†)φ⟩* = ⟨Â†ψ|φ⟩* ... Applying the adjoint definition twice recovers the original operator. Therefore (Â†)† = Â. □", height: 0.72 },
        { heading: "DECOMPOSITION THEOREM", body: "Every operator decomposes uniquely into Hermitian and anti-Hermitian parts:\nÂ = (Â + Â†)/2 + (Â − Â†)/2\n    = Â_H + Â_AH\nwhere Â_H is Hermitian and Â_AH is anti-Hermitian.", height: 0.6 }
      ],
      formula: [
        "Hermitian: Â = Â†",
        "Anti-Hermitian: Â = −Â†",
        "(Â†)† = Â  [involution]",
        "Â_H = (Â + Â†)/2",
        "Â_AH = (Â − Â†)/2"
      ],
      example: [
        "Decompose Â = [[1+i, 2],[3, 4−i]]:",
        "Â† = [[1−i, 3],[2, 4+i]]",
        "Â_H = [[1, 5/2],[5/2, 4]] (Hermitian part)",
        "Â_AH = [[i, −1/2],[1/2, −i]] (anti-Hermitian)",
        "─ Verify: Â_H = Â_H†  ✓",
        "─ Verify: Â_AH† = −Â_AH  ✓",
        "─ Check: Â_H + Â_AH = Â  ✓"
      ]
    }
  ],
  tierContent: [
    { // HS
      objectives: ["Understand inner product as 'overlap' between states", "Interpret norm as 'length' of a quantum state", "Use ℝ² and ℂ² as concrete finite-dimensional examples", "Identify Hermitian vs. non-Hermitian 2×2 matrices by inspection"],
      example: ["ℂ² example: |+⟩ = (1,0), |−⟩ = (0,1)", "⟨+|−⟩ = 1·0 + 0·1 = 0 (orthogonal)", "‖|+⟩‖ = √(1²+0²) = 1 (normalised)", "σ_z = [[1,0],[0,−1]]: σ_z† = σ_z ✓ Hermitian"],
      problems: ["P1: Compute ⟨φ|ψ⟩ for |φ⟩=(1,i)/√2, |ψ⟩=(i,1)/√2", "P2: Verify σ_x is Hermitian; verify iσ_x is anti-Hermitian", "P3: Find ‖α|+⟩ + β|−⟩‖ in terms of |α|, |β|"],
      extensions: ["Connect to arrow addition in 2D", "Phase factors e^(iθ) as unit complex numbers", "Superposition = vector addition in ℂ²"]
    },
    { // BegUG
      objectives: ["Verify all four Hilbert space axioms for ℂⁿ", "Compute Â† for explicit 2×2 and 3×3 matrices", "State definition of bounded operator and operator norm", "Apply Cauchy–Schwarz: |⟨φ|ψ⟩|² ≤ ‖φ‖²‖ψ‖²"],
      example: ["Compute Â† for Â = [[1+i, 2−i],[3i, 4]]:", "Step 1: Transpose → [[1+i, 3i],[2−i, 4]]", "Step 2: Complex conjugate → [[1−i, −3i],[2+i, 4]]", "So Â† = [[1−i, −3i],[2+i, 4]]"],
      problems: ["P1: Compute adjoint of a general 2×2 complex matrix", "P2: Verify axiom (IP2) for L²([0,1]) explicitly", "P3: Show the operator norm satisfies ‖Â‖ ≥ 0", "P4: Is σ_z + iσ_y Hermitian, anti-Hermitian, or neither?"],
      extensions: ["Proof that ‖Â‖ = ‖Â†‖ for bounded operators", "Connection to Frobenius norm ‖Â‖_F = √Tr(Â†Â)"]
    },
    { // AdvUG
      objectives: ["Prove adjoint is unique given inner product structure", "Derive (ÂB̂)† = B̂†Â† from the adjoint definition", "Construct explicit examples of unbounded operators", "Show that bounded ⟺ continuous for linear operators"],
      example: ["Prove (ÂB̂)† = B̂†Â†:", "⟨φ|(ÂB̂)ψ⟩ = ⟨Â†φ|B̂ψ⟩ = ⟨B̂†Â†φ|ψ⟩", "By uniqueness of adjoint: (ÂB̂)† = B̂†Â† □", "─ Key: adjoint reverses operator order"],
      problems: ["P1: Prove adjoint is unique (use non-degeneracy of IP)", "P2: Show p̂ = −iℏd/dx is Hermitian on S(ℝ) ⊂ L²(ℝ)", "P3: Prove bounded ⟺ continuous for linear operators on H", "P4: Find ‖σ_x‖ using the operator norm definition"],
      extensions: ["Closed graph theorem", "Hellinger–Toeplitz: everywhere-defined Hermitian ⟹ bounded"]
    },
    { // MSc
      objectives: ["Define L²(ℝ) rigorously via Lebesgue integration", "Compute operator norm and relate to spectral radius", "State and apply the Hellinger–Toeplitz theorem", "Connect bounded ↔ continuous and domain considerations"],
      example: ["Compute ‖x̂‖ on L²([-N,N]):", "For ψₙ = χ_[n,n+1]/√1, ‖x̂ψₙ‖ ≈ n → ∞", "So x̂ is unbounded on L²(ℝ) ✓", "But ‖x̂‖ on L²([-N,N]) = N (finite, bounded) ✓"],
      problems: ["P1: Use Riesz–Fischer to prove L²(ℝ) is complete", "P2: Prove operator norm ‖Â‖ = sup of spectrum |σ(Â)|", "P3: State Hellinger–Toeplitz theorem; give counterexample"],
      extensions: ["Spectral radius formula: r(Â) = lim ‖Âⁿ‖^(1/n)", "Relation to spectral theorem for bounded self-adjoint operators"]
    },
    { // PhD
      objectives: ["Analyse spectrum of unbounded operators rigorously", "Distinguish domain issues for Hermitian vs. self-adjoint operators", "State the Hellinger–Toeplitz theorem with proof sketch", "Classify operators by their deficiency indices"],
      example: ["Domain distinction for p̂ on L²([0,1]):", "D(p̂_min) = H¹₀(0,1): p̂ is Hermitian, not self-adjoint", "D(p̂_θ) = {ψ: ψ(1) = e^(iθ)ψ(0)}: self-adjoint extension", "Each θ ∈ [0,2π) gives distinct self-adjoint extension!"],
      problems: ["P1: Prove Hellinger–Toeplitz: dom(Â) = H, Hermitian ⟹ bounded", "P2: Compute deficiency indices (n₊,n₋) for p̂ on L²([0,1])"],
      extensions: ["Closed operators and closed extensions", "Von Neumann deficiency index theorem", "Spectral theory: resolvent set, point/continuous/residual spectrum"]
    }
  ],
  pitfalls: {
    a: ["Confusing 'Hermitian' with 'self-adjoint' — they differ for unbounded operators on domains D(Â) ⊊ H",
        "Forgetting complex conjugation in adjoint: (Â†)ᵢⱼ = Â*ⱼᵢ not Âⱼᵢ",
        "Assuming all operators on H are bounded — x̂ and p̂ are not"],
    b: ["Treating ⟨φ|ψ⟩ as symmetric — it is conjugate-symmetric: ⟨φ|ψ⟩ = ⟨ψ|φ⟩*",
        "Confusing operator norm ‖Â‖ with Frobenius norm ‖Â‖_F",
        "Forgetting that anti-Hermitian operators have imaginary (not real) eigenvalues"],
    history: ["Hilbert (1900s): spectral theory of integral operators",
              "von Neumann (1932): Mathematical Foundations of QM — axiomatic Hilbert space",
              "Hellinger & Toeplitz (1910): unbounded symmetric operators",
              "Stone (1930s): self-adjoint extensions and domains"],
    formulas: ["Inner product: ⟨φ|ψ⟩ = Σᵢφᵢ*ψᵢ (ℂⁿ)",
               "Adjoint: (Â†)ᵢⱼ = Â*ⱼᵢ",
               "Norm: ‖|ψ⟩‖ = √⟨ψ|ψ⟩",
               "Classification: Â = Â† (Hermitian), Â = −Â† (anti-Herm.)"],
    connections: ["→ L02: Unitary operators Û with ÛÛ† = 1̂ built from Hermitian generators",
                  "→ L03: Spectral theorem requires self-adjoint operators; real eigenvalues",
                  "→ L04: Matrix exponential e^(iÂ) uses adjoint structure extensively"]
  },
  assessmentTiers: [
    ["Problems: 3 simple + 2 advanced\nProject (simple, ~1h): Inner Product Visualiser in ℂ²\nProject (adv, ~2-3h): Norm of L² Functions\nResearch: Explain why complex amplitudes are necessary for quantum interference"],
    ["Problems: 5 simple + 2 advanced\nProject (simple, ~2h): Adjoint Calculator with Verification\nProject (adv, ~4h): Operator Norms for 3×3 Matrices\nResearch: Prove Cauchy–Schwarz inequality from the axioms"],
    ["Problems: 3 simple + 3 advanced\nProject (simple, ~2h): Bounded vs. Unbounded Operator Explorer\nProject (adv, ~6h): Domain of p̂ on L²([0,1])\nResearch: Prove bounded ⟺ continuous for linear maps on H"],
    ["Problems: 2 simple + 3 advanced\nProject (simple, ~3h): L² Completeness via Cauchy Sequences\nProject (adv, ~8h): Operator norm vs. Frobenius norm study\nResearch: Hellinger–Toeplitz theorem — statement, proof, implications"],
    ["Problems: 2 simple + 3 advanced\nProject (simple, ~3h): Rigour Checklist for Hilbert Space Axioms\nProject (adv, ~15h): Self-Adjoint Extensions of p̂ on [0,1]\nResearch: Von Neumann's deficiency index theory"]
  ],
  refs: {
    primary: ["Sakurai & Napolitano\nModern Quantum Mechanics, 3rd ed.\nCh. 1: Fundamental Concepts\n─",
              "Dirac, P.A.M.\nPrinciples of Quantum Mechanics, 4th ed.\nCh. 1–2: Notation & Hilbert Space\n─",
              "Nielsen & Chuang\nQuantum Computation & Quantum Information\nCh. 2: Linear Algebra Primer"],
    educational: ["Reed & Simon\nMethods of Modern Mathematical Physics, Vol. 1\nCh. 2: Hilbert Spaces\n─",
                  "Galindo & Pascual\nQuantum Mechanics I\nCh. 1: Mathematical Framework\n─",
                  "Thirring\nQuantum Mathematical Physics\nCh. 1: Hilbert Space Theory"],
    historical: ["von Neumann (1932)\nMathematical Foundations of Quantum Mechanics\n↳ Foundational axiomatic treatment\n─",
                 "Hilbert (1912)\nGrundzüge einer allgemeinen Theorie der linearen Integralgleichungen\n↳ Origin of Hilbert space concept\n─",
                 "Hellinger & Toeplitz (1910)\nGrundsätzliches über Sturm-Liouville'sche Theorie\n↳ First treatment of unbounded operators"]
  }
},

// ─────────────────────────────────────────────────────────
// L02: Unitary Operators and Symmetry Transformations
// ─────────────────────────────────────────────────────────
{
  code: "L02",
  title: "Unitary Operators and Symmetry Transformations",
  subtitle: "Preservation of Structure — Module I.1, Lecture 2",
  pacing: [
    "0–15 min: Recap — inner products and adjoint from L01",
    "15–40 min: Definition of unitary: ÛÛ† = Û†Û = 1̂; inner product preservation",
    "40–65 min: Physical incarnations: rotations Û(θ), translations T̂(a), time evolution e^(−iĤt/ℏ)",
    "65–90 min: Unitary equivalence of operators; spectral invariance; Stone's theorem preview"
  ],
  outcomes: [
    "Verify unitarity ÛÛ† = 1̂ from definition and examples",
    "Prove that unitary maps preserve norms and transition probabilities",
    "Identify unitary operators from physical symmetries (rotation, translation, phase)",
    "Understand Û = e^(iĜ) for Hermitian generator Ĝ (Stone's theorem preview)"
  ],
  tierSummary: [
    "Rotations as length-preserving maps; rotating a quantum state without losing information",
    "Verify ÛÛ† = 1̂ for rotation matrices; compute Û|ψ⟩ for explicit states",
    "Show eigenvalues of unitary operators lie on unit circle; prove spectral invariance",
    "One-parameter groups; Stone's theorem; generator Ĝ and Lie algebra connection",
    "Strongly continuous unitary groups on Banach spaces; Hille–Yosida theorem"
  ],
  assessment: [
    "Set A — verify unitarity for 2×2 rotation and phase matrices; compute Û|ψ⟩",
    "Set B — prove unitary ⟹ isometric; show spectrum of Û lies on |z| = 1",
    "Projects: animate unitary evolution of two-level state (simple); matrix exponential e^(iθĜ) (complex)"
  ],
  trackA: {
    title: "PHYSICAL TRACK — Symmetry and Conservation Laws",
    sections: [
      { title: "SYMMETRY AS STRUCTURE PRESERVATION", body: "A symmetry is a transformation that leaves the physics unchanged. In QM, this means preserving transition probabilities |⟨φ|ψ⟩|² → invariant. By Wigner's theorem (L05), every such symmetry is implemented by a unitary or anti-unitary operator." },
      { title: "SPATIAL ROTATIONS Û(θ)", body: "A rotation by angle θ around axis n̂ is implemented by Û(θ) = e^(−iθn̂·Ĵ/ℏ) where Ĵ is the angular momentum operator. Unitarity guarantees ‖Û(θ)|ψ⟩‖ = ‖|ψ⟩‖ — rotation doesn't change normalisation." },
      { title: "TRANSLATIONS AND TIME EVOLUTION", body: "Spatial translation by a: T̂(a) = e^(−iap̂/ℏ). Time evolution: Û(t) = e^(−iĤt/ℏ). Both are unitary (Ĥ and p̂ Hermitian), ensuring probability conservation. These are one-parameter unitary groups." },
      { title: "NOETHER'S THEOREM PREVIEW", body: "Each continuous symmetry → conserved quantity. Rotational invariance → [Ĥ, Ĵ] = 0 → angular momentum conserved. Translational invariance → [Ĥ, p̂] = 0 → momentum conserved." }
    ]
  },
  trackB: {
    title: "MATHEMATICAL TRACK — Unitary Groups and Stone's Theorem",
    sections: [
      { title: "UNITARY OPERATOR DEFINITION", body: "Û is unitary iff ÛÛ† = Û†Û = 1̂. Equivalent conditions: (1) Û is a bijective isometry, (2) Û preserves the inner product ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩, (3) Û has a bounded inverse Û⁻¹ = Û†." },
      { title: "SPECTRUM OF UNITARY OPERATORS", body: "All eigenvalues λ of a unitary operator Û lie on the unit circle |λ| = 1. Proof: Û|u⟩ = λ|u⟩ ⟹ ‖Û|u⟩‖² = |λ|²‖|u⟩‖² = ‖|u⟩‖² ⟹ |λ| = 1. So λ = e^(iφ) for some φ ∈ ℝ." },
      { title: "STONE'S THEOREM (STATEMENT)", body: "If {Û(t)}_{t∈ℝ} is a strongly continuous one-parameter unitary group on H, then there exists a unique self-adjoint operator Ĝ (the generator) such that Û(t) = e^(−itĜ). Conversely, any self-adjoint Ĝ generates a unitary group." },
      { title: "UNITARY EQUIVALENCE", body: "Operators Â and B̂ = ÛÂÛ† are unitarily equivalent. They have identical spectra: σ(B̂) = σ(Â). Physically: physics is representation-independent — unitarily equivalent H's describe the same physics." }
    ]
  },
  sections: [
    {
      sectionCode: "L02.1",
      title: "Unitary Operators: Definition and Properties",
      subtitle: "Structure-preserving maps on Hilbert space",
      content: [
        { heading: "DEFINITION OF UNITARY OPERATOR", body: "An operator Û: H → H is unitary if ÛÛ† = Û†Û = 1̂. This means: (1) Û is surjective (onto), (2) Û preserves inner products ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩, (3) Û has a bounded inverse Û⁻¹ = Û†.", height: 0.65 },
        { heading: "PRESERVATION OF TRANSITION PROBABILITIES", body: "For any |φ⟩, |ψ⟩ ∈ H:\n|⟨Ûφ|Ûψ⟩|² = |⟨φ|Û†Ûψ⟩|² = |⟨φ|ψ⟩|²\nThis is precisely what is needed for physical symmetries — measuring outcomes doesn't change under unitary transformation.", height: 0.7 },
        { heading: "EIGENVALUES ON THE UNIT CIRCLE", body: "If Û|u⟩ = λ|u⟩ then ‖λ|u⟩‖ = ‖Û|u⟩‖ = ‖|u⟩‖ ⟹ |λ| = 1. All eigenvalues take the form λ = e^(iφ) for φ ∈ ℝ. The spectrum of Û is a subset of the unit circle in ℂ.", height: 0.6 },
        { heading: "UNITARY GROUP U(H)", body: "The set of all unitary operators on H forms a group U(H) under composition. Closure: ÛV̂ unitary; identity: 1̂; inverse: Û† = Û⁻¹; associativity: operator composition. For dim H = n, this is the Lie group U(n).", height: 0.6 }
      ],
      formula: [
        "ÛÛ† = Û†Û = 1̂",
        "⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩",
        "|λ| = 1 for eigenvalue λ",
        "Û⁻¹ = Û†"
      ],
      example: [
        "2D rotation matrix:",
        "Û(θ) = [[cos θ, −sin θ],[sin θ, cos θ]]",
        "Û†(θ) = Û(−θ) = Û(θ)ᵀ (real matrix)",
        "Û(θ)Û†(θ) = 1̂  ✓ (cos²θ+sin²θ = 1)",
        "─",
        "Phase gate: Û = [[1,0],[0,e^(iφ)]]",
        "ÛÛ† = diag(1,1) = 1̂  ✓ unitary"
      ]
    },
    {
      sectionCode: "L02.2",
      title: "Û = e^(iĜ): The Exponential Map",
      subtitle: "Unitary operators from Hermitian generators",
      content: [
        { heading: "GENERATING UNITARIES FROM HERMITIAN OPERATORS", body: "If Ĝ is Hermitian (Ĝ = Ĝ†), then Û(θ) = e^(iθĜ) is unitary for all θ ∈ ℝ. Proof: Û†(θ) = (e^(iθĜ))† = e^(−iθĜ†) = e^(−iθĜ) = Û(−θ) = Û⁻¹(θ). So ÛÛ† = 1̂. □", height: 0.72 },
        { heading: "STONE'S THEOREM (PREVIEW)", body: "Conversely, every strongly continuous one-parameter unitary group {Û(t)}_{t∈ℝ} arises from a unique self-adjoint generator Ĝ via Û(t) = e^(−itĜ). This makes Hermitian operators fundamental: they generate all continuous symmetries.", height: 0.65 },
        { heading: "PHYSICAL EXAMPLES", body: "• Phase: Û(θ) = e^(iθ) (global phase, trivial generator 1̂)\n• Rotation: Û_z(θ) = e^(−iθŜ_z/ℏ) (Ŝ_z = spin generator)\n• Time evolution: Û(t) = e^(−iĤt/ℏ) (Ĥ = Hamiltonian)\n• Translations: T̂(a) = e^(−iap̂/ℏ) (p̂ = momentum)", height: 0.72 },
        { heading: "SPECTRAL INVARIANCE", body: "If Â|aₙ⟩ = aₙ|aₙ⟩ and B̂ = ÛÂÛ†, then B̂(Û|aₙ⟩) = aₙ(Û|aₙ⟩). The eigenvalues are identical; only the eigenvectors are rotated. Physics is representation-independent.", height: 0.55 }
      ],
      formula: [
        "Û = e^(iθĜ), Ĝ = Ĝ†",
        "Û† = e^(−iθĜ)",
        "ÛÛ† = e^(iθĜ)e^(−iθĜ) = 1̂",
        "σ(ÛÂÛ†) = σ(Â)"
      ],
      example: [
        "Û_z(θ) = e^(−iθσ_z/2) for spin-1/2:",
        "σ_z = diag(1,−1), so:",
        "e^(−iθσ_z/2) = diag(e^(−iθ/2), e^(iθ/2))",
        "• Eigenvalues: e^(±iθ/2) — on unit circle ✓",
        "• Ûσ_xÛ† = cos(θ)σ_x + sin(θ)σ_y",
        "─ Spectrum of σ_x unchanged: {+1, −1} ✓"
      ]
    },
    {
      sectionCode: "L02.3",
      title: "Physical Symmetries as Unitary Operators",
      subtitle: "Rotations, translations, and time evolution",
      content: [
        { heading: "SPATIAL ROTATIONS: U(1) AND SU(2)", body: "For spin-1/2 particles, rotations by angle θ around axis n̂ are implemented by Û_n(θ) = e^(−iθn̂·σ̂/2) ∈ SU(2). A 2π rotation gives Û = −1̂ (spinor phase flip), while a 4π rotation returns to identity.", height: 0.65 },
        { heading: "SPATIAL TRANSLATIONS T̂(a)", body: "T̂(a)|x⟩ = |x+a⟩ is a unitary operator implementing spatial translation by a. In momentum basis: T̂(a) = e^(−iap̂/ℏ). Verify: T̂(a)T̂(b) = T̂(a+b), T̂(a)† = T̂(−a). Generator = p̂.", height: 0.65 },
        { heading: "TIME EVOLUTION Û(t) = e^(−iĤt/ℏ)", body: "The Schrödinger equation i ℏ ∂|ψ⟩/∂t = Ĥ|ψ⟩ is solved by |ψ(t)⟩ = e^(−iĤt/ℏ)|ψ(0)⟩ = Û(t)|ψ(0)⟩. Since Ĥ = Ĥ†, Û(t) is unitary → probability is conserved.", height: 0.65 },
        { heading: "UNITARY EQUIVALENCE AND REPRESENTATIONS", body: "Two Hamiltonians Ĥ and Ĥ' = ÛĤÛ† are physically equivalent — they have the same energy spectrum and the same time evolution (up to the unitary basis change). This is the basis of representation theory.", height: 0.6 }
      ],
      formula: [
        "Û_n(θ) = e^(−iθn̂·Ĵ/ℏ)",
        "T̂(a) = e^(−iap̂/ℏ)",
        "Û(t) = e^(−iĤt/ℏ)",
        "⟨ψ(t)|ψ(t)⟩ = ⟨ψ(0)|ψ(0)⟩ = 1"
      ],
      example: [
        "Two-level time evolution:",
        "Ĥ = ε σ_z/2, |ψ(0)⟩ = (1,0)ᵀ = |+⟩",
        "Û(t) = diag(e^(−iεt/2ℏ), e^(+iεt/2ℏ))",
        "|ψ(t)⟩ = e^(−iεt/2ℏ)|+⟩",
        "Probability: |⟨+|ψ(t)⟩|² = 1 ✓ (stays in |+⟩)",
        "─ If Ĥ = ε σ_x/2: Rabi oscillations appear!"]
    }
  ],
  tierContent: [
    {
      objectives: ["Understand rotations as length-preserving maps", "Recognise that quantum evolution preserves probabilities", "Identify unitary 2×2 matrices by inspection", "Compute Û|ψ⟩ for simple states"],
      example: ["Phase gate: Û = [[1,0],[0,i]]", "ÛÛ† = [[1,0],[0,i]]·[[1,0],[0,−i]] = [[1,0],[0,1]] ✓", "Apply to |ψ⟩ = (1/√2)(1,1)ᵀ:", "Û|ψ⟩ = (1/√2)(1, i)ᵀ  (phase shifted)"],
      problems: ["P1: Is Û = [[0,1],[1,0]] unitary? (Verify ÛÛ† = 1̂)", "P2: Show that |⟨φ|Ûψ⟩|² = |⟨Û†φ|ψ⟩|²", "P3: What is the eigenvalue of Û = e^(iπσ_z/2)?"],
      extensions: ["Physical interpretation: unitary = no information loss", "Connection to quantum error correction: unitaries are reversible"]
    },
    {
      objectives: ["Verify ÛÛ† = 1̂ for explicit rotation and phase matrices", "Prove preservation of inner products from unitarity", "Compute e^(iθσ_z) using Taylor series or diagonalisation", "Identify generator from a given one-parameter family"],
      example: ["Verify e^(iθσ_z) is unitary:", "σ_z = diag(1,−1), e^(iθσ_z) = diag(e^(iθ), e^(−iθ))", "(e^(iθσ_z))† = diag(e^(−iθ), e^(iθ)) = e^(−iθσ_z)", "Product: e^(iθσ_z)·e^(−iθσ_z) = 1̂ ✓"],
      problems: ["P1: Compute e^(iφσ_z) using the power series definition", "P2: Verify unitarity of Hadamard gate H = (σ_x+σ_z)/√2", "P3: Find the generator of the phase group e^(iθ·1̂)"],
      extensions: ["CNOT gate as unitary on ℂ⁴", "Bloch sphere picture of SU(2) rotations"]
    },
    {
      objectives: ["Prove unitary ⟹ isometric (norm-preserving)", "Show eigenvalues of unitary operators lie on |λ|=1", "Prove spectral invariance under unitary similarity: σ(ÛÂÛ†) = σ(Â)", "Derive one-parameter group property Û(s+t) = Û(s)Û(t)"],
      example: ["Prove spectral invariance:", "If Â|a⟩ = a|a⟩, let |ã⟩ = Û|a⟩", "ÛÂÛ†(Û|a⟩) = ÛÂ|a⟩ = aÛ|a⟩ = a|ã⟩", "So Û|a⟩ is eigenvector of ÛÂÛ† with same eigenvalue a □"],
      problems: ["P1: Prove unitary ⟹ isometric using ÛÛ† = 1̂", "P2: Show σ(Û) ⊆ {z∈ℂ: |z|=1} rigorously", "P3: Prove Û(s)Û(t) = Û(s+t) for Û(t) = e^(itĜ)"],
      extensions: ["Schur's lemma and its consequences for unitary representations", "Relation between unitary groups and Lie algebras"]
    },
    {
      objectives: ["State Stone's theorem precisely with strong continuity", "Identify the generator of a given unitary group", "Connect unitary groups to Lie algebra via iĜ", "Apply spectral invariance to change of basis problems"],
      example: ["Stone's theorem application:", "Given Û(t) = e^(−it p̂/ℏ) on L²(ℝ)", "Generator: Ĝ = p̂/ℏ (self-adjoint ✓)", "Strong continuity: ‖Û(t)|ψ⟩ − |ψ⟩‖ → 0 as t → 0 ✓"],
      problems: ["P1: State Stone's theorem; identify generator of Û(t) = e^(−iĤt/ℏ)", "P2: Show iĜ (generator) is anti-Hermitian when Ĝ is Hermitian", "P3: Prove the Lie algebra u(n) consists of anti-Hermitian matrices"],
      extensions: ["Strongly continuous vs. norm-continuous groups", "Hille–Yosida theorem for semigroups"]
    },
    {
      objectives: ["State and apply the Hille–Yosida theorem to unitary groups", "Analyse domain of the generator in the Stone theorem", "Classify unitary representations of compact Lie groups", "Connect spectral theory of Û to functional calculus of Ĝ"],
      example: ["Domain of generator via Stone's theorem:", "D(Ĝ) = {|ψ⟩ ∈ H : lim_{t→0} (Û(t)−1̂)|ψ⟩/t exists}", "For Û(t) = e^(−iĤt/ℏ): D(Ĝ) = D(Ĥ)", "Strong derivative: d/dt Û(t)|ψ⟩|_{t=0} = −iĤ|ψ⟩/ℏ ∈ H iff |ψ⟩ ∈ D(Ĥ)"],
      problems: ["P1: Prove domain of generator in Stone's theorem is dense in H", "P2: Show unitary groups on H are always strongly continuous"],
      extensions: ["C*-algebra approach to quantum symmetries", "Projective unitary representations and central extensions"]
    }
  ],
  pitfalls: {
    a: ["Confusing ÛÛ† = 1̂ with Û² = 1̂ — unitarity is NOT the same as involutory",
        "Forgetting that e^(iθĜ) requires Ĝ to be Hermitian (not just symmetric) for unitarity",
        "Assuming 2π rotation returns a spinor to itself — it gives a minus sign for spin-1/2"],
    b: ["Confusing the generator Ĝ (Hermitian) with the group element e^(iθĜ) (unitary)",
        "Treating spectral invariance as trivial — it requires careful proof for unbounded Â",
        "Mixing up U(n) (unitary group) and SU(n) (special unitary group, det = 1)"],
    history: ["Wigner (1931): unitary and anti-unitary symmetries in QM",
              "Stone (1932): one-parameter unitary groups and their generators",
              "Noether (1918): symmetry → conservation law (classical)",
              "Weyl (1927): group theory in quantum mechanics"],
    formulas: ["Unitarity: ÛÛ† = 1̂ ↔ ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩",
               "Generator: Û(t) = e^(itĜ), Ĝ = Ĝ†",
               "Spectral: σ(ÛÂÛ†) = σ(Â)",
               "Eigenvalues: λ ∈ σ(Û) ⟹ |λ| = 1"],
    connections: ["→ L03: Spectral theorem applies to Hermitian generators of unitary groups",
                  "→ L05: Wigner's theorem classifies all quantum symmetries as unitary or anti-unitary",
                  "← L01: Unitary operators are bounded with ‖Û‖ = 1"]
  },
  assessmentTiers: [
    ["Problems: 3 simple + 1 advanced\nProject (~1h): Rotation visualiser on Bloch sphere\nProject (adv, ~2h): Unitary matrix randomiser\nResearch: Why does a 360° spin rotation flip the sign?"],
    ["Problems: 4 simple + 2 advanced\nProject (~2h): e^(iθσₙ) calculator for all axes\nProject (adv, ~4h): Rabi oscillation simulator\nResearch: Prove that any 2×2 unitary = e^(iφ)Û_n(θ) for some n̂, θ"],
    ["Problems: 3 simple + 3 advanced\nProject (~2h): Spectral invariance demo\nProject (adv, ~6h): Group structure of SU(2) rotations\nResearch: Derive the BCH formula for SU(2) generators"],
    ["Problems: 2 simple + 3 advanced\nProject (~3h): Stone's theorem verification\nProject (adv, ~8h): Lie algebra of U(n)\nResearch: Stone's theorem — statement, proof strategy, physical significance"],
    ["Problems: 2 simple + 3 advanced\nProject (~4h): Domain analysis for translation group\nProject (adv, ~15h): Projective representations\nResearch: Hille–Yosida and quantum dynamics"]
  ],
  refs: {
    primary: ["Sakurai & Napolitano\nModern Quantum Mechanics\nCh. 4: Symmetries in Quantum Mechanics\n─",
              "Dirac\nPrinciples of Quantum Mechanics\nCh. 26: Quantum Conditions\n─",
              "Weinberg\nLectures on Quantum Mechanics\nCh. 8: Symmetries"],
    educational: ["Galindo & Pascual\nQuantum Mechanics II\nCh. 8: Symmetry Groups\n─",
                  "Tung\nGroup Theory in Physics\nCh. 5: Representations\n─",
                  "Ballentine\nQuantum Mechanics: A Modern Development\nCh. 3: Kinematics"],
    historical: ["Stone (1932)\nOn One-Parameter Unitary Groups in Hilbert Space\nAnnals of Mathematics 33\n↳ Original proof of Stone's theorem\n─",
                 "Wigner (1931)\nGruppentheorie und ihre Anwendung auf die Quantenmechanik\n↳ Wigner's symmetry theorem\n─",
                 "Noether (1918)\nInvariante Variationsprobleme\n↳ Symmetry–conservation correspondence"]
  }
},

// ─────────────────────────────────────────────────────────
// L03: Observables, Hermitian Operators, and the Spectral Theorem
// ─────────────────────────────────────────────────────────
{
  code: "L03",
  title: "Observables, Hermitian Operators, and the Spectral Theorem",
  subtitle: "Measurement Postulate and Spectral Decomposition — Module I.1, Lecture 3",
  pacing: [
    "0–20 min: The measurement postulate — observables ↔ Hermitian operators; real outcomes",
    "20–45 min: Key properties: real eigenvalues, orthogonality, completeness of eigenbasis",
    "45–70 min: Spectral theorem (discrete): Â = Σₐ a|a⟩⟨a|; functions f(Â) of operators",
    "70–90 min: Degenerate eigenvalues; continuous spectrum preview; physical examples x̂, p̂, Ĥ"
  ],
  outcomes: [
    "State and apply the measurement postulate linking observables to Hermitian operators",
    "Prove Hermitian operators have real eigenvalues and orthogonal eigenvectors",
    "Write spectral decomposition Â = Σₐ a|a⟩⟨a| and compute f(Â) for simple functions",
    "Handle degenerate eigenvalues using Gram–Schmidt orthogonalisation"
  ],
  tierSummary: [
    "Measuring an observable always gives one of its eigenvalues — Stern–Gerlach story",
    "Find eigenvalues/vectors of 2×2 Hermitian matrices; write spectral form",
    "Prove real eigenvalues and orthogonality; handle degenerate case with Gram–Schmidt",
    "Spectral theorem in full generality; functions of operators; self-adjoint vs. Hermitian",
    "Spectral measure and projection-valued measure (PVM); Borel functional calculus"
  ],
  assessment: [
    "Set A — diagonalise Hermitian matrices; compute e^(iÂ) via spectral decomposition",
    "Set B — prove spectral theorem for n×n Hermitian matrices; degenerate subspace orthogonalisation",
    "Projects: eigenvalue/eigenvector visualiser for 2×2 observables (simple); spectral resolution of harmonic oscillator (complex)"
  ],
  trackA: {
    title: "PHYSICAL TRACK — Sakurai: Measurement and Stern–Gerlach",
    sections: [
      { title: "MEASUREMENT POSTULATE", body: "When observable Â is measured on state |ψ⟩, the outcome is always one of the eigenvalues {aₙ} of Â. The probability of obtaining aₙ is P(aₙ) = |⟨aₙ|ψ⟩|². After measurement, state collapses to |aₙ⟩." },
      { title: "STERN–GERLACH PARADIGM", body: "Silver atoms pass through inhomogeneous B-field: deflected into discrete spots corresponding to eigenvalues of Ŝ_z = {+ℏ/2, −ℏ/2}. This directly demonstrates the eigenvalue postulate — no in-between values observed." },
      { title: "PREPARATION vs. MEASUREMENT", body: "Preparation: select only atoms deflected upward → state |+z⟩. Measurement: apply another SG apparatus → probability distribution. The state |+z⟩ encodes all measurement statistics." },
      { title: "PHYSICAL EXAMPLES OF OBSERVABLES", body: "Position x̂: eigenvalues x ∈ ℝ (continuous), eigenstates |x⟩ (not normalisable). Momentum p̂ = −iℏ∂_x: eigenvalues p ∈ ℝ. Hamiltonian Ĥ (particle in box): discrete eigenvalues Eₙ = n²π²ℏ²/(2mL²)." }
    ]
  },
  trackB: {
    title: "ABSTRACT TRACK — Dirac: Spectral Theorem and Resolution of Identity",
    sections: [
      { title: "SPECTRAL THEOREM (DISCRETE CASE)", body: "If Â is a Hermitian operator with discrete spectrum {aₙ} and orthonormal eigenstates {|aₙ⟩}, then: Â = Σₙ aₙ |aₙ⟩⟨aₙ| (spectral decomposition). The projectors P̂ₙ = |aₙ⟩⟨aₙ| satisfy Σₙ P̂ₙ = 1̂." },
      { title: "RESOLUTION OF IDENTITY", body: "1̂ = Σₙ |aₙ⟩⟨aₙ| (discrete case) or 1̂ = ∫da |a⟩⟨a| (continuous case). Inserting this anywhere is the fundamental trick of QM calculations: ⟨φ|ψ⟩ = Σₙ ⟨φ|aₙ⟩⟨aₙ|ψ⟩." },
      { title: "FUNCTIONS OF OPERATORS", body: "Given f: ℝ → ℂ, define f(Â) := Σₙ f(aₙ)|aₙ⟩⟨aₙ|. Examples: e^(iÂ) = Σₙ e^(iaₙ)|aₙ⟩⟨aₙ| (unitary when Â = Â†); Â² = Σₙ aₙ²|aₙ⟩⟨aₙ|; √Â for aₙ ≥ 0." },
      { title: "PROJECTION-VALUED MEASURE (PVM)", body: "The collection {P̂ₙ = |aₙ⟩⟨aₙ|} satisfies: P̂ₙ² = P̂ₙ, P̂ₙP̂ₘ = δₙₘP̂ₙ, Σₙ P̂ₙ = 1̂. This is a projection-valued measure. ⟨Â⟩ = Σₙ aₙP(aₙ) with P(aₙ) = ⟨ψ|P̂ₙ|ψ⟩." }
    ]
  },
  sections: [
    {
      sectionCode: "L03.1",
      title: "The Measurement Postulate",
      subtitle: "Physical observables and Hermitian operators",
      content: [
        { heading: "THE MEASUREMENT POSTULATE", body: "Postulate: Every physical observable corresponds to a Hermitian operator Â = Â† on H. When Â is measured:\n(M1) The only possible outcomes are the eigenvalues {aₙ} of Â.\n(M2) If system is in state |ψ⟩, the probability of obtaining aₙ is P(aₙ) = |⟨aₙ|ψ⟩|².\n(M3) Immediately after measurement, the state collapses to the eigenstate |aₙ⟩.", height: 0.82 },
        { heading: "WHY HERMITIAN? — THREE REQUIREMENTS", body: "(i) Real eigenvalues: physical measurement outcomes must be real numbers ⟹ Â = Â†. (ii) Orthogonal eigenstates: distinct outcomes are mutually exclusive. (iii) Completeness of eigenbasis: all possible states can be expressed as superpositions of measurement outcomes.", height: 0.7 },
        { heading: "EXPECTATION VALUE", body: "⟨Â⟩ = ⟨ψ|Â|ψ⟩ = Σₙ aₙ|⟨aₙ|ψ⟩|² = Σₙ aₙ P(aₙ). This is the weighted average of eigenvalues with probabilities as weights — exactly the classical mean.", height: 0.55 },
        { heading: "VARIANCE AND UNCERTAINTY", body: "(ΔÂ)² = ⟨Â²⟩ − ⟨Â⟩². If |ψ⟩ = |aₙ⟩ (eigenstate), then ΔÂ = 0 (definite value). If |ψ⟩ is a superposition, ΔÂ > 0 (genuine quantum uncertainty, not ignorance).", height: 0.55 }
      ],
      formula: [
        "P(aₙ) = |⟨aₙ|ψ⟩|²",
        "⟨Â⟩ = ⟨ψ|Â|ψ⟩",
        "(ΔÂ)² = ⟨Â²⟩ − ⟨Â⟩²",
        "Collapse: |ψ⟩ → |aₙ⟩"
      ],
      example: [
        "Stern–Gerlach: Ŝ_z = (ℏ/2)σ_z",
        "Eigenvalues: +ℏ/2 (spin-up), −ℏ/2 (spin-down)",
        "|ψ⟩ = α|+⟩ + β|−⟩, |α|²+|β|² = 1",
        "P(+ℏ/2) = |α|², P(−ℏ/2) = |β|²",
        "⟨Ŝ_z⟩ = (ℏ/2)(|α|² − |β|²)",
        "─ If |ψ⟩ = |+x⟩ = (|+⟩+|−⟩)/√2:",
        "P(+ℏ/2) = P(−ℏ/2) = 1/2, ⟨Ŝ_z⟩ = 0"
      ]
    },
    {
      sectionCode: "L03.2",
      title: "Properties of Hermitian Operators",
      subtitle: "Real eigenvalues, orthogonality, and completeness",
      content: [
        { heading: "THEOREM: REAL EIGENVALUES", body: "Proof: Let Â|aₙ⟩ = aₙ|aₙ⟩ with |aₙ⟩ ≠ 0. Then:\naₙ⟨aₙ|aₙ⟩ = ⟨aₙ|Â|aₙ⟩ = ⟨Â†aₙ|aₙ⟩ = ⟨Âaₙ|aₙ⟩ = aₙ*⟨aₙ|aₙ⟩\nSince ⟨aₙ|aₙ⟩ > 0: aₙ = aₙ* ⟹ aₙ ∈ ℝ. □", height: 0.72 },
        { heading: "THEOREM: ORTHOGONALITY OF EIGENSTATES", body: "Proof: Let Â|aₙ⟩ = aₙ|aₙ⟩, Â|aₘ⟩ = aₘ|aₘ⟩ with aₙ ≠ aₘ.\n⟨aₘ|Â|aₙ⟩ = aₙ⟨aₘ|aₙ⟩  [from right]\n⟨aₘ|Â|aₙ⟩ = aₘ⟨aₘ|aₙ⟩  [from left, using Â=Â†]\n(aₙ − aₘ)⟨aₘ|aₙ⟩ = 0. Since aₙ ≠ aₘ: ⟨aₘ|aₙ⟩ = 0. □", height: 0.75 },
        { heading: "SPECTRAL THEOREM (FINITE DIMENSION)", body: "Every n×n Hermitian matrix Â has n real eigenvalues a₁,...,aₙ (with repetition for degeneracy) and n orthonormal eigenvectors |a₁⟩,...,|aₙ⟩ forming a complete basis. Hence Â = ΣΣₙ aₙ|aₙ⟩⟨aₙ|.", height: 0.65 },
        { heading: "DEGENERATE CASE — GRAM–SCHMIDT", body: "If aₙ = aₘ for n ≠ m (degeneracy), eigenvectors in the degenerate subspace are not uniquely determined but can be chosen orthonormal via Gram–Schmidt. Any orthonormal basis of the degenerate subspace works.", height: 0.55 }
      ],
      formula: [
        "Â = Â†  ⟹  aₙ ∈ ℝ",
        "aₙ ≠ aₘ  ⟹  ⟨aₘ|aₙ⟩ = 0",
        "Â = Σₙ aₙ|aₙ⟩⟨aₙ|",
        "1̂ = Σₙ|aₙ⟩⟨aₙ|"
      ],
      example: [
        "Diagonalise Â = [[2,1],[1,2]] (Hermitian):",
        "Characteristic eqn: (2−λ)² − 1 = 0",
        "λ₁ = 3: |a₁⟩ = (1,1)ᵀ/√2",
        "λ₂ = 1: |a₂⟩ = (1,−1)ᵀ/√2",
        "Check: ⟨a₁|a₂⟩ = (1·1 + 1·(−1))/(2) = 0 ✓",
        "Spectral form: Â = 3|a₁⟩⟨a₁| + 1|a₂⟩⟨a₂|"
      ]
    },
    {
      sectionCode: "L03.3",
      title: "Functions of Operators and the Spectral Decomposition",
      subtitle: "Computing f(Â) and the resolution of identity",
      content: [
        { heading: "FUNCTIONS OF HERMITIAN OPERATORS", body: "Given the spectral decomposition Â = Σₙ aₙ|aₙ⟩⟨aₙ|, define:\nf(Â) := Σₙ f(aₙ)|aₙ⟩⟨aₙ|\nThis works for any function f: ℝ → ℂ. The result is an operator on H with eigenvectors {|aₙ⟩} and eigenvalues {f(aₙ)}.", height: 0.7 },
        { heading: "KEY EXAMPLES", body: "• e^(iÂ): eigenvalues → e^(iaₙ), unitary when Â = Â† (since |e^(iaₙ)| = 1)\n• Â² = Σₙ aₙ²|aₙ⟩⟨aₙ|\n• Â⁻¹ = Σₙ aₙ⁻¹|aₙ⟩⟨aₙ| (exists iff 0 ∉ spectrum)\n• |Â|² = Â†Â = Σₙ |aₙ|²|aₙ⟩⟨aₙ| = Â² for Hermitian Â", height: 0.7 },
        { heading: "RESOLUTION OF IDENTITY", body: "The projectors P̂ₙ = |aₙ⟩⟨aₙ| satisfy:\n• P̂ₙ† = P̂ₙ (Hermitian)\n• P̂ₙ² = P̂ₙ (idempotent)\n• P̂ₙP̂ₘ = δₙₘP̂ₙ (orthogonal)\n• Σₙ P̂ₙ = 1̂ (completeness)\nThis is a projection-valued measure (PVM) — the mathematical backbone of quantum measurement.", height: 0.75 },
        { heading: "CONTINUOUS SPECTRUM PREVIEW", body: "For x̂ and p̂: eigenvalues form a continuous set. Resolution of identity becomes an integral: 1̂ = ∫dx|x⟩⟨x|. Functions: f(x̂)|ψ⟩ = ∫dx f(x)⟨x|ψ⟩|x⟩ = f(x)ψ(x) (multiplication operator in position basis).", height: 0.6 }
      ],
      formula: [
        "f(Â) = Σₙ f(aₙ)|aₙ⟩⟨aₙ|",
        "e^(iÂ) = Σₙ e^(iaₙ)|aₙ⟩⟨aₙ|",
        "P̂ₙ = |aₙ⟩⟨aₙ|",
        "Σₙ P̂ₙ = 1̂"
      ],
      example: [
        "Compute e^(iÂ) for Â = [[π,0],[0,0]]:",
        "Eigenvalues: π (eigenvec. e₁), 0 (eigenvec. e₂)",
        "e^(iÂ) = e^(iπ)|e₁⟩⟨e₁| + e^(0)|e₂⟩⟨e₂|",
        "= (−1)·diag(1,0) + 1·diag(0,1)",
        "= diag(−1, 1) = −σ_z",
        "─ Check directly: (e^(iπσ_z/...)) ✓"]
    }
  ],
  tierContent: [
    {
      objectives: ["Connect measurement outcome to eigenvalue of observable", "Describe the Stern–Gerlach experiment conceptually", "Compute P(aₙ) = |⟨aₙ|ψ⟩|² for simple 2-level systems", "Interpret ⟨Â⟩ as the average measurement outcome"],
      example: ["Spin-1/2 measurement: Ŝ_z has eigenvalues ±ℏ/2", "|ψ⟩ = (3|+⟩ + 4|−⟩)/5", "P(+ℏ/2) = (3/5)² = 9/25", "P(−ℏ/2) = (4/5)² = 16/25", "⟨Ŝ_z⟩ = (ℏ/2)(9/25) + (−ℏ/2)(16/25) = −7ℏ/50"],
      problems: ["P1: Find P(+) and P(−) for |ψ⟩ = (|+⟩+i|−⟩)/√2", "P2: What is ⟨σ_x⟩ for the state |+z⟩?", "P3: After measuring Ŝ_z and getting +ℏ/2, what is the new state?"],
      extensions: ["Spin precession in magnetic field", "Connection to classical probability for eigenstate case"]
    },
    {
      objectives: ["Find eigenvalues and eigenvectors of 2×2 Hermitian matrices", "Write the spectral decomposition Â = Σaₙ|aₙ⟩⟨aₙ|", "Apply resolution of identity to simplify ⟨φ|Â|ψ⟩", "Compute f(Â) = Σf(aₙ)|aₙ⟩⟨aₙ| for polynomial and exponential f"],
      example: ["Â = σ_x = [[0,1],[1,0]]", "Eigenvalues: +1 (|+x⟩=(|+⟩+|−⟩)/√2), −1 (|−x⟩=(|+⟩−|−⟩)/√2)", "Spectral form: σ_x = |+x⟩⟨+x| − |−x⟩⟨−x|", "e^(iθσ_x) = e^(iθ)|+x⟩⟨+x| + e^(−iθ)|−x⟩⟨−x|"],
      problems: ["P1: Diagonalise Â = [[3,1−i],[1+i,2]]; verify real eigenvalues", "P2: Compute e^(iπσ_y/2) using spectral decomposition", "P3: Verify Σₙ|aₙ⟩⟨aₙ| = 1̂ for σ_z eigenstates"],
      extensions: ["Simultaneous eigenstates of commuting operators", "CSCO (Complete Set of Commuting Observables)"]
    },
    {
      objectives: ["Prove real eigenvalues and eigenvector orthogonality rigorously", "Apply Gram–Schmidt to degenerate eigenspaces", "Construct the full spectral projector decomposition", "Derive the variance formula from the spectral decomposition"],
      example: ["Prove ⟨aₘ|aₙ⟩ = 0 for aₘ ≠ aₙ (Hermitian Â):", "aₙ⟨aₘ|aₙ⟩ = ⟨aₘ|Â|aₙ⟩ = ⟨Â†aₘ|aₙ⟩ = aₘ*⟨aₘ|aₙ⟩ = aₘ⟨aₘ|aₙ⟩", "(aₙ − aₘ)⟨aₘ|aₙ⟩ = 0, aₙ ≠ aₘ ⟹ ⟨aₘ|aₙ⟩ = 0 □"],
      problems: ["P1: Prove spectral theorem for 2×2 Hermitian matrices", "P2: Handle 2-fold degenerate eigenspace via Gram–Schmidt", "P3: Show (ΔÂ)² ≥ 0 using spectral decomposition"],
      extensions: ["Functional calculus via Cauchy integral formula", "CSCO: n commuting Hermitian operators with joint eigenbasis"]
    },
    {
      objectives: ["State the spectral theorem in its general form (bounded self-adjoint)", "Define the Borel functional calculus f(Â) rigorously", "Distinguish self-adjoint from merely Hermitian operators", "Apply projection-valued measures to compute ⟨Â⟩ and ΔÂ"],
      example: ["PVM for harmonic oscillator Ĥ = ℏω(N̂+1/2):", "Eigenvalues: Eₙ = ℏω(n+1/2), n = 0,1,2,...", "P̂ₙ = |n⟩⟨n| (projector onto n-th Fock state)", "⟨E⟩ = Σₙ Eₙ|cₙ|² where cₙ = ⟨n|ψ⟩"],
      problems: ["P1: State spectral theorem for bounded self-adjoint operators", "P2: Compute f(N̂) for f(n) = e^(−βℏωn) (partition function)", "P3: Distinguish Hermitian vs. self-adjoint for p̂ on L²([0,1])"],
      extensions: ["Borel functional calculus — spectral measures", "Spectral theorem for unbounded self-adjoint operators"]
    },
    {
      objectives: ["Define projection-valued measures (PVM) rigorously", "Apply the Borel functional calculus", "Classify spectrum: point, continuous, residual", "Analyse the continuous spectrum of x̂ and p̂ via PVM"],
      example: ["PVM for x̂ on L²(ℝ):", "For Borel set E ⊆ ℝ: P̂_E = ∫_E |x⟩⟨x|dx (multiplication by χ_E)", "⟨ψ|P̂_E|ψ⟩ = ∫_E |ψ(x)|²dx = P(x ∈ E) ✓", "1̂ = ∫_{-∞}^{∞} |x⟩⟨x|dx (resolution of identity) ✓"],
      problems: ["P1: Define PVM axioms; verify they hold for x̂", "P2: Compute the spectral measure for p̂ via Fourier transform"],
      extensions: ["Rigged Hilbert space for continuous spectrum eigenstates", "Gel'fand triple Φ ⊂ H ⊂ Φ' for |x⟩, |p⟩"]
    }
  ],
  pitfalls: {
    a: ["Believing a measurement gives ⟨Â⟩ as the result — it always gives an eigenvalue, not the expectation value",
        "Confusing orthogonality of eigenvectors (inner product = 0) with independence of events",
        "Assuming degenerate eigenvectors are automatically orthogonal — they must be orthogonalised"],
    b: ["Confusing the spectral decomposition Â = Σaₙ|aₙ⟩⟨aₙ| with a matrix representation (it is operator identity)",
        "Applying f(Â) via Taylor series without verifying convergence — use spectral decomposition instead",
        "Treating 'Hermitian' and 'self-adjoint' as identical — they differ for unbounded operators (MSc/PhD)"],
    history: ["Heisenberg (1925): matrix mechanics — observables as matrices",
              "Schrödinger (1926): wave mechanics — observables as differential operators",
              "Born (1926): probability interpretation of |ψ|²",
              "von Neumann (1932): spectral theorem and measurement theory"],
    formulas: ["Spectral: Â = Σₙ aₙ|aₙ⟩⟨aₙ|",
               "P(aₙ) = |⟨aₙ|ψ⟩|² = ⟨ψ|P̂ₙ|ψ⟩",
               "f(Â) = Σₙ f(aₙ)|aₙ⟩⟨aₙ|",
               "1̂ = Σₙ |aₙ⟩⟨aₙ| (completeness)"],
    connections: ["→ L04: Functions of operators e^(iÂ) use spectral decomposition",
                  "→ L05: Projectors P̂ = |φ⟩⟨φ| are rank-1 spectral projectors",
                  "← L01: Hermitian operators are the observables; adjoint structure is essential"]
  },
  assessmentTiers: [
    ["Problems: 3 simple + 2 advanced\nProject (~1h): Stern–Gerlach probability simulator\nProject (adv, ~2h): Spin expectation value plotter\nResearch: Why are measurement outcomes always eigenvalues?"],
    ["Problems: 5 simple + 2 advanced\nProject (~2h): Eigenvalue solver for 2×2 Hermitian matrices\nProject (adv, ~4h): Spectral decomposition visualiser\nResearch: Prove the spectral theorem for 2×2 Hermitian matrices from scratch"],
    ["Problems: 4 simple + 3 advanced\nProject (~3h): Gram–Schmidt in degenerate eigenspaces\nProject (adv, ~6h): f(Â) calculator via spectral decomposition\nResearch: Prove completeness of eigenbasis for n×n Hermitian matrices"],
    ["Problems: 2 simple + 3 advanced\nProject (~3h): PVM for spin-1/2 observables\nProject (adv, ~8h): Borel functional calculus for H₀ (harmonic oscillator)\nResearch: Borel functional calculus — construction and applications"],
    ["Problems: 2 simple + 3 advanced\nProject (~4h): Spectral measure for x̂ on L²(ℝ)\nProject (adv, ~15h): PVM for continuous spectrum operators\nResearch: Spectral theorem for unbounded self-adjoint operators"]
  ],
  refs: {
    primary: ["Sakurai & Napolitano\nModern Quantum Mechanics\nCh. 1: Fundamental Concepts (§1.3–1.5)\n─",
              "Dirac\nPrinciples of Quantum Mechanics\nCh. 10: Observables\n─",
              "Cohen-Tannoudji, Diu & Laloë\nQuantum Mechanics Vol. 1\nCh. 2: Postulates"],
    educational: ["Shankar\nPrinciples of Quantum Mechanics\nCh. 1: Mathematical Introduction\n─",
                  "Ballentine\nQuantum Mechanics: A Modern Development\nCh. 2: The Formulation of QM\n─",
                  "Isham\nLectures on Quantum Theory\nCh. 5: The Spectral Theorem"],
    historical: ["von Neumann (1932)\nMathematical Foundations of QM\nCh. 2–3: Spectral Theory\n↳ Original rigorous spectral theorem for QM\n─",
                 "Heisenberg (1925)\nÜber quantentheoretische Umdeutung\nZ. Phys. 33\n↳ Matrix mechanics birthplace\n─",
                 "Born (1926)\nZur Quantenmechanik der Stossvorgänge\n↳ Probabilistic interpretation of ψ"]
  }
},

// ─────────────────────────────────────────────────────────
// L04: Operator Algebra and the Exponential Map
// ─────────────────────────────────────────────────────────
{
  code: "L04",
  title: "Operator Algebra and the Exponential Map",
  subtitle: "Non-commutativity, Matrix Exponentials, and BCH — Module I.1, Lecture 4",
  pacing: [
    "0–15 min: Operator arithmetic — sums, products, scalar multiples; non-commutativity",
    "15–40 min: Functions of operators via power series and spectral decomposition; matrix exponential",
    "40–65 min: The map e^(iθÂ) for Hermitian Â: unitarity proof; one-parameter families; applications",
    "65–90 min: Baker–Campbell–Hausdorff (BCH): e^Âe^B̂ = e^(Â+B̂+[Â,B̂]/2+...); applications"
  ],
  outcomes: [
    "Perform operator arithmetic and recognise non-commutativity [Â,B̂] ≠ 0",
    "Compute matrix exponentials via diagonalisation and power series",
    "Prove Û = e^(iθÂ) is unitary when Â is Hermitian",
    "State the BCH lemma and apply it to first order in the commutator"
  ],
  tierSummary: [
    "Exponential of a matrix as infinite sum; rotation by small angles",
    "Compute e^(iθσ_z); verify unitarity numerically",
    "Prove unitarity of e^(iθÂ) rigorously; derive BCH to first order",
    "Full BCH series; Zassenhaus formula; group algebra correspondence",
    "Convergence of BCH in Banach algebras; Magnus expansion; quantum control"
  ],
  assessment: [
    "Set A — compute e^(iθσ_z), e^(iφσ_y); verify unitarity; simple BCH applications",
    "Set B — prove BCH to second order; derive Hadamard identity e^Â B̂ e^(−Â)",
    "Projects: matrix exponential calculator with visualisation (simple); BCH vs. exact product comparison (complex)"
  ],
  trackA: {
    title: "COMPUTATIONAL TRACK — Step-by-Step Matrix Exponentials",
    sections: [
      { title: "COMPUTING e^A VIA DIAGONALISATION", body: "If Â = UDU† with D = diag(λ₁,...,λₙ), then e^Â = U·diag(e^λ₁,...,e^λₙ)·U†. For 2×2 Pauli matrices: σₙ² = 1̂, so e^(iθσₙ) = cos(θ)1̂ + i sin(θ)σₙ — a rotation matrix!" },
      { title: "e^(iθσ_z) — WORKED IN DETAIL", body: "σ_z = diag(1,−1): e^(iθσ_z) = diag(e^(iθ), e^(−iθ)). Verify: (e^(iθσ_z))(e^(iθσ_z))† = diag(e^(iθ),e^(−iθ))·diag(e^(−iθ),e^(iθ)) = 1̂. ✓ Unitary." },
      { title: "e^(iφσ_x) AND e^(iφσ_y)", body: "e^(iφσ_x) = [[cos φ, i sin φ],[i sin φ, cos φ]] — rotation by 2φ around x-axis. e^(iφσ_y) = [[cos φ, sin φ],[−sin φ, cos φ]] — rotation by 2φ around y-axis. The 2 arises because spin = ½." },
      { title: "PHYSICAL APPLICATION: RABI OSCILLATIONS", body: "Two-level atom: Ĥ = (ℏΩ/2)σ_x. Evolution: Û(t) = e^(−iΩtσ_x/2) = cos(Ωt/2)1̂ − i sin(Ωt/2)σ_x. Starting in |↑⟩: P(|↓⟩) = sin²(Ωt/2) — Rabi oscillations." }
    ]
  },
  trackB: {
    title: "ALGEBRAIC TRACK — Lie Brackets, BCH, and Operator Algebras",
    sections: [
      { title: "OPERATOR ALGEBRA AND LIE BRACKET", body: "The set of bounded operators B(H) forms an associative algebra under composition. The commutator [Â,B̂] = ÂB̂ − B̂Â is the Lie bracket, satisfying antisymmetry and Jacobi identity [[Â,B̂],Ĉ] + [[B̂,Ĉ],Â] + [[Ĉ,Â],B̂] = 0." },
      { title: "BAKER–CAMPBELL–HAUSDORFF FORMULA", body: "e^Â e^B̂ = e^(Â+B̂+[Â,B̂]/2+([Â,[Â,B̂]]−[B̂,[Â,B̂]])/12+...). First-order BCH: if [Â,B̂] commutes with Â and B̂, then e^Â e^B̂ = e^(Â+B̂+[Â,B̂]/2)." },
      { title: "HADAMARD IDENTITY", body: "e^Â B̂ e^(−Â) = B̂ + [Â,B̂] + [Â,[Â,B̂]]/2! + [Â,[Â,[Â,B̂]]]/3! + ...\nThis is the 'adjoint action' of e^Â on B̂. For finite-dimensional matrices, this series terminates (nilpotent case) or converges rapidly." },
      { title: "ZASSENHAUS FORMULA (DUAL)", body: "e^(Â+B̂) = e^Â e^B̂ e^(−[Â,B̂]/2) e^... . This is the 'reverse BCH'. First-order: e^(Â+B̂) ≈ e^Â e^B̂ e^(−[Â,B̂]/2). Used in Trotter product formula for quantum simulation." }
    ]
  },
  sections: [
    {
      sectionCode: "L04.1",
      title: "Operator Arithmetic and Non-Commutativity",
      subtitle: "The algebra of quantum operators",
      content: [
        { heading: "OPERATOR ALGEBRA OPERATIONS", body: "Operators form a vector space under addition: (Â+B̂)|ψ⟩ = Â|ψ⟩ + B̂|ψ⟩. Multiplication (composition): (ÂB̂)|ψ⟩ = Â(B̂|ψ⟩). Scalar multiplication: (λÂ)|ψ⟩ = λ(Â|ψ⟩). Together: operators form an associative algebra.", height: 0.65 },
        { heading: "NON-COMMUTATIVITY AND THE COMMUTATOR", body: "In general ÂB̂ ≠ B̂Â. The commutator [Â,B̂] := ÂB̂ − B̂Â measures the failure of commutativity. Fundamental QM: [x̂,p̂] = iℏ — this single equation encodes Heisenberg uncertainty! [Ŝ_x,Ŝ_y] = iℏŜ_z for angular momentum.", height: 0.7 },
        { heading: "COMMUTATOR ALGEBRA RULES", body: "[Â,B̂] = −[B̂,Â]  [antisymmetry]\n[Â,B̂+Ĉ] = [Â,B̂] + [Â,Ĉ]  [linearity]\n[Â,B̂Ĉ] = [Â,B̂]Ĉ + B̂[Â,Ĉ]  [Leibniz rule]\n[Â,[B̂,Ĉ]] + [B̂,[Ĉ,Â]] + [Ĉ,[Â,B̂]] = 0  [Jacobi]", height: 0.72 },
        { heading: "ANTI-COMMUTATOR", body: "The anti-commutator {Â,B̂} := ÂB̂ + B̂Â satisfies {Â,B̂} = {B̂,Â}. Every product can be decomposed: ÂB̂ = ([Â,B̂] + {Â,B̂})/2. For Pauli matrices: {σᵢ,σⱼ} = 2δᵢⱼ1̂ and [σᵢ,σⱼ] = 2iεᵢⱼₖσₖ.", height: 0.55 }
      ],
      formula: [
        "[Â,B̂] = ÂB̂ − B̂Â",
        "{Â,B̂} = ÂB̂ + B̂Â",
        "[x̂,p̂] = iℏ",
        "[Ŝᵢ,Ŝⱼ] = iℏεᵢⱼₖŜₖ"
      ],
      example: [
        "Verify [σ_x, σ_y] = 2iσ_z:",
        "σ_xσ_y = [[0,1],[1,0]]·[[0,−i],[i,0]]",
        "= [[i,0],[0,−i]] = iσ_z",
        "σ_yσ_x = [[0,−i],[i,0]]·[[0,1],[1,0]]",
        "= [[−i,0],[0,i]] = −iσ_z",
        "[σ_x,σ_y] = iσ_z − (−iσ_z) = 2iσ_z ✓"]
    },
    {
      sectionCode: "L04.2",
      title: "The Matrix Exponential",
      subtitle: "Power series, diagonalisation, and convergence",
      content: [
        { heading: "DEFINITION VIA POWER SERIES", body: "e^Â := Σₙ₌₀^∞ Âⁿ/n! = 1̂ + Â + Â²/2! + Â³/3! + ...\nThis series converges in operator norm for any bounded operator Â. For Hermitian Â = Σₙ aₙ|aₙ⟩⟨aₙ|, it reproduces e^Â = Σₙ e^(aₙ)|aₙ⟩⟨aₙ| consistently.", height: 0.7 },
        { heading: "COMPUTATION VIA DIAGONALISATION", body: "Method: (1) Find eigensystem Â = ΣᵢλᵢP̂ᵢ. (2) Apply: e^Â = Σᵢe^(λᵢ)P̂ᵢ. For 2×2 Pauli: σₙ² = 1̂ ⟹ e^(iθσₙ) = (Σₖ(iθ)^(2k)/(2k)!)1̂ + (Σₖ(iθ)^(2k+1)/(2k+1)!)σₙ = cos θ 1̂ + i sin θ σₙ.", height: 0.7 },
        { heading: "KEY PROPERTIES OF e^Â", body: "• (e^Â)† = e^(Â†): takes adjoint of exponent\n• If Â = Â†: e^(iÂ) is unitary since (e^(iÂ))† = e^(−iÂ) = (e^(iÂ))⁻¹\n• det(e^Â) = e^(Tr Â)\n• If [Â,B̂] = 0: e^(Â+B̂) = e^Â e^B̂ (commutative case)", height: 0.65 },
        { heading: "UNITARITY PROOF", body: "If Â = Â† (Hermitian), then:\n(e^(iÂ))† = e^(−iÂ†) = e^(−iÂ)\ne^(iÂ)(e^(iÂ))† = e^(iÂ)e^(−iÂ) = e^(iÂ−iÂ) = e^0 = 1̂ [using [Â,−Â]=0]\nTherefore e^(iÂ) is unitary whenever Â is Hermitian. □", height: 0.65 }
      ],
      formula: [
        "e^Â = Σₙ Âⁿ/n!",
        "e^(iθσₙ) = cos θ 1̂ + i sin θ σₙ",
        "(e^Â)† = e^(Â†)",
        "det(e^Â) = e^(Tr Â)"
      ],
      example: [
        "Compute e^(iπσ_x/2):",
        "e^(iθσ_x) = cos θ 1̂ + i sin θ σ_x",
        "At θ = π/2: cos(π/2)=0, sin(π/2)=1",
        "e^(iπσ_x/2) = i σ_x = [[0,i],[i,0]]",
        "Verify unitary: (iσ_x)(iσ_x)† = (iσ_x)(−iσ_x)",
        "= σ_x² = 1̂ ✓"]
    },
    {
      sectionCode: "L04.3",
      title: "Baker–Campbell–Hausdorff Formula",
      subtitle: "Combining non-commuting exponentials",
      content: [
        { heading: "THE BCH FORMULA", body: "When [Â,B̂] ≠ 0, e^Â e^B̂ ≠ e^(Â+B̂). The correct result is:\ne^Â e^B̂ = e^(Â+B̂+C̃)\nwhere C̃ = [Â,B̂]/2 + ([Â,[Â,B̂]] − [B̂,[Â,B̂]])/12 + ...\nThis is the Baker–Campbell–Hausdorff formula.", height: 0.7 },
        { heading: "FIRST-ORDER BCH", body: "When commutators of commutators vanish (e.g., [Â,B̂] = cŜ central):\ne^Â e^B̂ = e^(Â+B̂+[Â,B̂]/2)\nUseful when ‖Â‖, ‖B̂‖ ≪ 1 as first-order approximation in small parameters.", height: 0.6 },
        { heading: "HADAMARD LEMMA", body: "e^Â B̂ e^(−Â) = B̂ + [Â,B̂] + [Â,[Â,B̂]]/2! + ...\n= Σₙ (ad_Â)ⁿ(B̂)/n!\nwhere ad_Â(B̂) = [Â,B̂] is the adjoint action. For nilpotent commutators, this terminates.", height: 0.6 },
        { heading: "TROTTER PRODUCT FORMULA", body: "e^(Â+B̂) = lim_{N→∞} (e^(Â/N)e^(B̂/N))^N\nFirst-order Trotter: e^(ε(Â+B̂)) ≈ e^(εÂ)e^(εB̂) + O(ε²[Â,B̂]).\nUsed in quantum simulation (Trotterisation of time-evolution operators).", height: 0.65 }
      ],
      formula: [
        "e^Âe^B̂ = e^(Â+B̂+[Â,B̂]/2+...)",
        "e^ÂB̂e^(−Â) = Σₙ (adÂ)ⁿ(B̂)/n!",
        "[Â,B̂]/2 (first order BCH)",
        "Trotter: (e^(Â/N)e^(B̂/N))^N → e^(Â+B̂)"
      ],
      example: [
        "BCH for spin operators: Â = iθσ_x, B̂ = iφσ_y",
        "[iθσ_x, iφσ_y] = −θφ[σ_x,σ_y] = −2iθφσ_z",
        "First-order BCH: e^(iθσ_x)e^(iφσ_y) ≈ e^(i(θσ_x+φσ_y−θφσ_z))",
        "─ Valid when θ, φ ≪ 1",
        "─ Compare to exact product (numerical verification)"]
    }
  ],
  tierContent: [
    {
      objectives: ["Understand the matrix exponential as an infinite sum analogy with e^x", "Compute e^(iθσ_z) by recognising the diagonal structure", "Recognise non-commutativity through a concrete 2×2 example", "Apply BCH conceptually: 'extra correction term from non-commutativity'"],
      example: ["e^x = 1 + x + x²/2! + ... (scalar)", "e^Â = 1̂ + Â + Â²/2! + ... (matrix version)", "For σ_z = diag(1,−1): Â² = 1̂, Â³ = Â, ...", "e^(iθσ_z) = diag(e^(iθ), e^(−iθ)) ✓"],
      problems: ["P1: Compute e^(iπσ_z) using the diagonal structure", "P2: Show [σ_x, σ_z] ≠ 0 by explicit multiplication", "P3: What would go wrong if x̂ and p̂ commuted?"],
      extensions: ["Physical meaning of BCH: combining two rotations gives a third rotation + correction", "Connection to Euler angles for rotations"]
    },
    {
      objectives: ["Compute e^(iθσ_z) and e^(iφσ_x) using diagonalisation", "Verify unitarity numerically for computed exponentials", "Apply the Leibniz rule for commutators", "State BCH first-order and identify when it applies"],
      example: ["Compute e^(iθσ_x):", "Eigenvalues of σ_x: ±1; eigenvecs |±x⟩ = (|+⟩±|−⟩)/√2", "e^(iθσ_x) = e^(iθ)|+x⟩⟨+x| + e^(−iθ)|−x⟩⟨−x|", "= cos θ·1̂ + i sin θ·σ_x", "Verify: (e^(iθσ_x))†(e^(iθσ_x)) = 1̂ ✓"],
      problems: ["P1: Compute e^(iφσ_y) and verify unitarity", "P2: Compute [σ_z, e^(iθσ_x)] using Hadamard lemma first-order", "P3: Apply first-order BCH to e^(εσ_x)e^(εσ_y)"],
      extensions: ["Rotation group SU(2): all elements = e^(iθn̂·σ/2)", "Euler decomposition e^(iασ_z)e^(iβσ_y)e^(iγσ_z)"]
    },
    {
      objectives: ["Prove unitarity of e^(iÂ) rigorously when Â is Hermitian", "Derive BCH to first order from the power series", "State and prove the Hadamard identity", "Apply BCH to relate products of rotation operators"],
      example: ["Prove e^(iÂ) is unitary if Â = Â†:", "(e^(iÂ))† = Σₙ(iÂ)ⁿ†/n! = Σₙ(−iÂ†)ⁿ/n! = e^(−iÂ)", "e^(iÂ)e^(−iÂ) = e^(iÂ−iÂ) = e^0 = 1̂ [Â commutes with itself]", "∴ e^(iÂ) is unitary □"],
      problems: ["P1: Prove unitarity of e^(iÂ) using power series and Â = Â†", "P2: Derive Hadamard identity e^ÂB̂e^(−Â) to second order in Â", "P3: Use BCH to combine e^(iθσ_z)e^(iφσ_x) to first order in θ,φ"],
      extensions: ["Zassenhaus formula: e^(Â+B̂) = e^Âe^B̂e^(−[Â,B̂]/2)...", "Magnus expansion for time-ordered exponentials"]
    },
    {
      objectives: ["State the full BCH formula with all relevant terms", "Apply the Zassenhaus formula as the dual of BCH", "Connect BCH to the structure of Lie algebras and Lie groups", "Analyse convergence of BCH for small operators"],
      example: ["BCH for translation and boost operators:", "[x̂, p̂] = iℏ (central)", "e^(iap̂/ℏ)e^(ibx̂/ℏ) = e^(i(ap̂+bx̂)/ℏ + [iap̂/ℏ, ibx̂/ℏ]/2)", "= e^(i(ap̂+bx̂)/ℏ) · e^(−ab/2) (Weyl relation!)"],
      problems: ["P1: Derive BCH to second order using Campbell's formula", "P2: Verify Weyl relation e^(iap̂/ℏ)e^(ibx̂/ℏ) = e^(−iab/ℏ)e^(ibx̂/ℏ)e^(iap̂/ℏ)"],
      extensions: ["BCH and the exponential map in Lie group theory", "Convergence radius of BCH series in Banach algebras"]
    },
    {
      objectives: ["Prove convergence of BCH series in Banach algebras", "Connect BCH to the exponential map in Lie theory", "Analyse Magnus expansion for time-dependent Hamiltonians", "Apply BCH to quantum control — combining pulse sequences"],
      example: ["Magnus expansion for time-dep. H:", "Û(T) = e^(Ω₁+Ω₂+...) where", "Ω₁ = ∫₀ᵀ H(t)dt", "Ω₂ = (1/2)∫₀ᵀ∫₀^t [H(t),H(t')]dt'dt", "Converges when ∫₀ᵀ‖H(t)‖dt < π ✓"],
      problems: ["P1: Prove BCH convergence for ‖Â‖, ‖B̂‖ < ln2/2", "P2: Compute Ω₁, Ω₂ for H(t) = Ω₀(cos(ωt)σ_x + sin(ωt)σ_y)"],
      extensions: ["Floquet theory and the effective Hamiltonian", "Dynamical decoupling via BCH pulse sequences"]
    }
  ],
  pitfalls: {
    a: ["e^(Â+B̂) ≠ e^Âe^B̂ when [Â,B̂] ≠ 0 — BCH correction term is mandatory",
        "The Pauli identity e^(iθσₙ) = cos θ 1̂ + i sin θ σₙ requires σₙ² = 1̂ — check this first",
        "Confusion between the commutator [Â,B̂] and the Lie bracket — they are the same thing!"],
    b: ["Forgetting that det(e^Â) = e^(Tr Â), not det(Â)",
        "Assuming BCH terminates — it only does when sufficiently many commutators vanish",
        "Misapplying Trotter formula: the error is O(ε²[Â,B̂]), not O(ε²)"],
    history: ["Baker (1905); Campbell (1897); Hausdorff (1906): BCH formula",
              "Zassenhaus (1961): dual formula to BCH",
              "Magnus (1954): Magnus expansion for time-ordered evolution",
              "Trotter (1959): Trotter product formula for semigroups"],
    formulas: ["e^Âe^B̂ = e^(Â+B̂+[Â,B̂]/2+...)",
               "e^(iθσₙ) = cos θ 1̂ + i sin θ σₙ",
               "e^ÂB̂e^(−Â) = Σₙ(adÂ)ⁿ(B̂)/n!",
               "det(e^Â) = e^(Tr Â)"],
    connections: ["→ L05: BCH appears in combining anti-unitary symmetries",
                  "← L03: Spectral decomposition is used to compute e^(iÂ)",
                  "← L02: e^(iθĜ) generates all unitary operators from Hermitian Ĝ"]
  },
  assessmentTiers: [
    ["Problems: 3 simple + 1 advanced\nProject (~1h): Visualise e^(iθσₙ) as Bloch sphere rotation\nProject (adv, ~2h): BCH error plotter\nResearch: Why does [x̂,p̂] = iℏ prevent simultaneous exact measurement?"],
    ["Problems: 4 simple + 2 advanced\nProject (~2h): Matrix exponential calculator for 2×2 Pauli matrices\nProject (adv, ~4h): Rabi oscillation simulator using e^(−iĤt)\nResearch: Derive e^(iθσₙ) = cos θ 1̂ + i sin θ σₙ from power series"],
    ["Problems: 3 simple + 3 advanced\nProject (~3h): BCH first-order vs. exact product comparison\nProject (adv, ~6h): Hadamard identity for spin operators\nResearch: Prove BCH formula to second order from power series"],
    ["Problems: 2 simple + 3 advanced\nProject (~3h): Weyl relations via BCH\nProject (adv, ~8h): Magnus expansion for sinusoidal drive\nResearch: BCH and the exponential map in Lie group theory"],
    ["Problems: 2 simple + 3 advanced\nProject (~4h): BCH convergence verification\nProject (adv, ~15h): Magnus expansion and Floquet theory\nResearch: Dynamical decoupling via BCH pulse sequences"]
  ],
  refs: {
    primary: ["Sakurai & Napolitano\nModern Quantum Mechanics\nCh. 2: Quantum Dynamics (§2.2)\n─",
              "Nielsen & Chuang\nQuantum Computation & QI\nCh. 4: Quantum Gates and Circuits\n─",
              "Messiah\nQuantum Mechanics Vol. 1\nCh. 8: Symmetry and Conservation Laws"],
    educational: ["Hall\nLie Groups, Lie Algebras, and Representations\nCh. 2: The Matrix Exponential\n─",
                  "Rossmann\nLie Groups: An Introduction Through Linear Groups\nCh. 1: BCH Formula\n─",
                  "Barnett\nQuantum Information\nCh. 2: Operators"],
    historical: ["Hausdorff (1906)\nDie symbolische Exponentialformel\nBerichte der sächsischen Akademie\n↳ Original BCH formula\n─",
                 "Magnus (1954)\nOn the exponential solution of ODE\nComm. Pure Appl. Math.\n↳ Magnus expansion\n─",
                 "Trotter (1959)\nOn the product of semi-groups of operators\nProc. AMS\n↳ Trotter product formula"]
  }
},

// ─────────────────────────────────────────────────────────
// L05: Types of Symmetry Operators and Wigner's Theorem
// ─────────────────────────────────────────────────────────
{
  code: "L05",
  title: "Types of Symmetry Operators and Wigner's Theorem",
  subtitle: "Linear/Anti-linear Symmetries and Projectors — Module I.1, Lecture 5",
  pacing: [
    "0–20 min: Taxonomy — linear vs. anti-linear; unitary vs. anti-unitary; time-reversal motivation",
    "20–50 min: Wigner's theorem — every quantum symmetry is unitary or anti-unitary; statement and significance",
    "50–70 min: Projectors P̂ = |φ⟩⟨φ|: idempotency P̂² = P̂, Hermiticity, eigenvalues {0,1}",
    "70–90 min: Time-reversal Θ̂ as anti-unitary; Kramers' theorem preview; degeneracy"
  ],
  outcomes: [
    "Distinguish linear/unitary from anti-linear/anti-unitary operators with examples",
    "State Wigner's theorem and explain its physical necessity",
    "Construct rank-1 projectors P̂ = |φ⟩⟨φ| and verify P̂² = P̂",
    "Explain how time-reversal is modelled by an anti-unitary operator"
  ],
  tierSummary: [
    "Symmetry as 'physics looks the same'; time-reversal intuitively running the film backwards",
    "Compute P̂² for rank-1 projectors; verify P̂ is Hermitian; classify operators as unitary/anti-unitary",
    "Prove eigenvalues of P̂ are 0 and 1; orthogonal projector resolution of identity",
    "Wigner's theorem proof sketch; complex conjugation as anti-unitary; Kramers' theorem statement",
    "Full proof of Wigner's theorem via Uhlhorn's theorem; anti-unitary representations; spin-statistics"
  ],
  assessment: [
    "Set A — verify P̂² = P̂ for explicit projectors; identify unitary vs. anti-unitary from basis action",
    "Set B — prove eigenvalues of a projector are {0,1}; show time-reversal squares to ±1 for integer/half-integer spin",
    "Projects: symmetry classification quiz for common operators (simple); Kramers degeneracy verification (complex)"
  ],
  trackA: {
    title: "PHYSICAL TRACK — Symmetries, Time-Reversal, and Kramers",
    sections: [
      { title: "SYMMETRY IN QUANTUM MECHANICS", body: "A quantum symmetry is a bijection on pure states (rays) that preserves transition probabilities: |⟨φ'|ψ'⟩|² = |⟨φ|ψ⟩|². By Wigner's theorem, such maps must be implemented by either a unitary or anti-unitary operator on H." },
      { title: "TIME-REVERSAL: RUNNING THE FILM BACKWARDS", body: "Under time-reversal t → −t: position x → +x, momentum p → −p, angular momentum L → −L, spin S → −S. This motivates Θ̂p̂Θ̂⁻¹ = −p̂ and Θ̂Ĵ Θ̂⁻¹ = −Ĵ. Complex conjugation K satisfies these for orbital angular momentum." },
      { title: "KRAMERS' THEOREM PREVIEW", body: "For a spin-1/2 system with Θ̂² = −1̂ (half-integer spin): every energy eigenstate is at least two-fold degenerate (Kramers pair). This is a symmetry-protected degeneracy — it cannot be lifted by any Θ̂-invariant perturbation." },
      { title: "ANTI-UNITARY IN CONDENSED MATTER", body: "Time-reversal symmetry (TRS) is central to topological classification of materials. TRS with Θ̂² = +1 (bosons) vs. Θ̂² = −1 (fermions) gives different topological classes — the 10-fold way." }
    ]
  },
  trackB: {
    title: "MATHEMATICAL TRACK — Anti-linear Maps and Projector Algebra",
    sections: [
      { title: "ANTI-LINEAR MAPS", body: "An operator Θ̂: H → H is anti-linear if Θ̂(α|φ⟩ + β|ψ⟩) = α*Θ̂|φ⟩ + β*Θ̂|ψ⟩ (complex conjugation of coefficients). This differs from linearity where Θ̂(α|φ⟩) = αΘ̂|φ⟩." },
      { title: "ANTI-UNITARY OPERATORS", body: "Θ̂ is anti-unitary if it is anti-linear and satisfies ⟨Θ̂φ|Θ̂ψ⟩ = ⟨ψ|φ⟩ = ⟨φ|ψ⟩* (conjugated inner product). Note the reversal: ⟨Θ̂φ|Θ̂ψ⟩ = ⟨ψ|φ⟩, not ⟨φ|ψ⟩. This is compatible with probability preservation since |⟨Θ̂φ|Θ̂ψ⟩| = |⟨φ|ψ⟩|." },
      { title: "RANK-1 PROJECTORS", body: "P̂_φ = |φ⟩⟨φ| for ‖|φ⟩‖ = 1. Properties: P̂² = P̂ (idempotent), P̂† = P̂ (Hermitian), eigenvalues {0,1} (0 for ⟨φ|ψ⟩=0, 1 for |ψ⟩ ∝ |φ⟩). Orthogonal projectors: P̂₁P̂₂ = 0 iff ⟨φ₁|φ₂⟩ = 0." },
      { title: "WIGNER'S THEOREM (STATEMENT)", body: "Every bijection T: PH → PH on projective Hilbert space that preserves transition probabilities |⟨φ|ψ⟩|² is implemented by either a unitary or anti-unitary operator Û on H, unique up to a phase." }
    ]
  },
  sections: [
    {
      sectionCode: "L05.1",
      title: "Linear vs. Anti-Linear Operators",
      subtitle: "Taxonomy of maps on Hilbert space",
      content: [
        { heading: "LINEAR AND ANTI-LINEAR OPERATORS", body: "Linear: Â(α|φ⟩+β|ψ⟩) = αÂ|φ⟩+βÂ|ψ⟩. All operators studied so far.\nAnti-linear: Θ̂(α|φ⟩+β|ψ⟩) = α*Θ̂|φ⟩+β*Θ̂|ψ⟩.\nThe key difference: anti-linear maps conjugate complex coefficients. Complex conjugation K itself is the prototype: K(ψ(x)) = ψ*(x).", height: 0.7 },
        { heading: "UNITARY AND ANTI-UNITARY", body: "Unitary Û: linear + ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩.\nAnti-unitary Θ̂: anti-linear + ⟨Θ̂φ|Θ̂ψ⟩ = ⟨ψ|φ⟩ = ⟨φ|ψ⟩*.\nBoth preserve transition probabilities: |⟨Θ̂φ|Θ̂ψ⟩| = |⟨ψ|φ⟩| = |⟨φ|ψ⟩|. Only anti-unitary operators can implement discrete symmetries like time-reversal.", height: 0.7 },
        { heading: "THE CANONICAL ANTI-UNITARY: COMPLEX CONJUGATION K", body: "K: L²(ℝ) → L²(ℝ), ψ(x) ↦ ψ*(x).\nK is anti-linear: K(αψ) = α*ψ*.\nK is anti-unitary: ⟨Kφ|Kψ⟩ = ∫φ(x)ψ*(x)dx = ⟨ψ|φ⟩. ✓\nK² = 1̂. For time-reversal of spin-1/2: Θ̂ = iσ_y K (gives Θ̂² = −1̂).", height: 0.7 },
        { heading: "WHY ANTI-UNITARY FOR TIME-REVERSAL?", body: "Under t → −t: Schrödinger equation iℏ∂_t|ψ⟩ = Ĥ|ψ⟩ becomes −iℏ∂_t|ψ(-t)⟩ = Ĥ|ψ(−t)⟩, i.e. iℏ∂_t|ψ'⟩ = Ĥ|ψ'⟩ where |ψ'(t)⟩ = |ψ(−t)⟩*. The complex conjugation is necessary — a linear unitary cannot implement time-reversal while preserving the Schrödinger equation.", height: 0.7 }
      ],
      formula: [
        "Linear: Â(α|φ⟩) = αÂ|φ⟩",
        "Anti-linear: Θ̂(α|φ⟩) = α*Θ̂|φ⟩",
        "Anti-unitary: ⟨Θ̂φ|Θ̂ψ⟩ = ⟨ψ|φ⟩",
        "K: ψ(x) ↦ ψ*(x)"
      ],
      example: [
        "Time-reversal for spin-1/2: Θ̂ = iσ_yK",
        "Action on |+⟩ = (1,0)ᵀ:",
        "K|+⟩ = |+⟩ (real vector), then",
        "iσ_y|+⟩ = i·[[0,−i],[i,0]]·(1,0)ᵀ = (0,1)ᵀ = |−⟩",
        "Θ̂|+⟩ = |−⟩, Θ̂|−⟩ = −|+⟩",
        "Θ̂²|+⟩ = Θ̂|−⟩ = −|+⟩ ⟹ Θ̂² = −1̂ ✓"]
    },
    {
      sectionCode: "L05.2",
      title: "Wigner's Theorem",
      subtitle: "Every quantum symmetry is unitary or anti-unitary",
      content: [
        { heading: "STATEMENT OF WIGNER'S THEOREM", body: "Let T: PH → PH be a bijection on projective Hilbert space (the space of rays) that preserves transition probabilities:\n|⟨φ|ψ⟩|² → |⟨Tφ|Tψ⟩|² = |⟨φ|ψ⟩|².\nThen T is implemented by an operator on H that is either unitary or anti-unitary, uniquely up to a global phase.", height: 0.75 },
        { heading: "WHY IS THIS THEOREM NEEDED?", body: "A priori, a symmetry is defined on the space of rays PH = H/U(1), not on H itself. Wigner's theorem 'lifts' the symmetry from PH back to H, showing that all quantum symmetries fit neatly into two categories: unitary (for continuous symmetries) and anti-unitary (for certain discrete symmetries like time-reversal).", height: 0.7 },
        { heading: "PROOF STRATEGY (SKETCH)", body: "Step 1: Fix an orthonormal basis {|eₙ⟩} and its image {|e'ₙ⟩ = T|eₙ⟩}.\nStep 2: Use probability preservation to show T is either linear or anti-linear on the basis.\nStep 3: Show the action on the basis extends consistently to all of H by linearity/anti-linearity.\nStep 4: Inner product preservation follows from probability preservation.", height: 0.72 },
        { heading: "PHYSICAL SIGNIFICANCE", body: "Wigner's theorem guarantees that the mathematical framework (unitary/anti-unitary operators) is complete — no exotic symmetries can exist outside this classification. This underpins all of representation theory in QM and the classification of particles by symmetry groups.", height: 0.6 }
      ],
      formula: [
        "|⟨Tφ|Tψ⟩|² = |⟨φ|ψ⟩|²",
        "T = Û (unitary) OR",
        "T = Θ̂ (anti-unitary)",
        "Unique up to global phase e^(iα)"
      ],
      example: [
        "Verify parity P̂ is unitary:",
        "P̂: ψ(x) ↦ ψ(−x) on L²(ℝ)",
        "P̂ is linear (no conjugation) ✓",
        "⟨P̂φ|P̂ψ⟩ = ∫φ*(−x)ψ(−x)dx",
        "= ∫φ*(y)ψ(y)dy = ⟨φ|ψ⟩ ✓ (unitary)",
        "─ Time-reversal Θ̂: anti-linear ⟹ anti-unitary ✓"]
    },
    {
      sectionCode: "L05.3",
      title: "Projectors and Projection Operators",
      subtitle: "Rank-1 projectors, idempotency, and the identity decomposition",
      content: [
        { heading: "DEFINITION: PROJECTOR", body: "P̂ is a projector (or projection operator) if P̂² = P̂ (idempotent) and P̂† = P̂ (Hermitian). The rank of P̂ is the dimension of its range (image space). Rank-1 projector: P̂ = |φ⟩⟨φ| for normalised |φ⟩.", height: 0.65 },
        { heading: "PROPERTIES OF RANK-1 PROJECTORS", body: "P̂² = (|φ⟩⟨φ|)(|φ⟩⟨φ|) = |φ⟩⟨φ|φ⟩⟨φ| = |φ⟩·1·⟨φ| = P̂ ✓\nP̂† = (|φ⟩⟨φ|)† = |φ⟩⟨φ| = P̂ ✓\nEigenvalues: P̂|φ⟩ = |φ⟩ (eigenvalue 1); P̂|ψ⊥⟩ = 0 (eigenvalue 0 for ⟨φ|ψ⊥⟩=0).", height: 0.7 },
        { heading: "PHYSICAL INTERPRETATION", body: "P̂_φ = |φ⟩⟨φ| projects any state |ψ⟩ onto the subspace spanned by |φ⟩:\nP̂|ψ⟩ = |φ⟩⟨φ|ψ⟩ = ⟨φ|ψ⟩|φ⟩.\nThe probability of finding state |φ⟩ when measuring: ⟨ψ|P̂|ψ⟩ = |⟨φ|ψ⟩|² = P(outcome = φ).", height: 0.65 },
        { heading: "ORTHOGONAL PROJECTORS AND COMPLETENESS", body: "If {|aₙ⟩} is an orthonormal basis: P̂ₙ = |aₙ⟩⟨aₙ| form orthogonal projectors:\nP̂ₙP̂ₘ = δₙₘP̂ₙ, Σₙ P̂ₙ = 1̂.\nEvery Hermitian operator decomposes as Â = ΣaₙP̂ₙ — this is the spectral theorem in projector language.", height: 0.65 }
      ],
      formula: [
        "P̂ = |φ⟩⟨φ|",
        "P̂² = P̂ (idempotent)",
        "P̂† = P̂ (Hermitian)",
        "σ(P̂) = {0, 1}",
        "⟨ψ|P̂|ψ⟩ = |⟨φ|ψ⟩|²"
      ],
      example: [
        "P̂ = |+x⟩⟨+x| where |+x⟩ = (|+⟩+|−⟩)/√2",
        "In matrix form: P̂ = [[1/2, 1/2],[1/2, 1/2]]",
        "P̂² = [[1/2,1/2],[1/2,1/2]]² = [[1/2,1/2],[1/2,1/2]] = P̂ ✓",
        "P̂† = (P̂*)ᵀ = [[1/2,1/2],[1/2,1/2]] = P̂ ✓",
        "Eigenvalues: char. poly λ(λ−1)=0 → {0,1} ✓"]
    },
    {
      sectionCode: "L05.4",
      title: "Time-Reversal and Kramers' Theorem",
      subtitle: "Anti-unitary symmetries and symmetry-protected degeneracy",
      content: [
        { heading: "TIME-REVERSAL OPERATOR Θ̂", body: "Time-reversal implements t → −t. For orbital (spinless) systems: Θ̂ = K (complex conjugation). For spin-1/2: Θ̂ = iσ_y K. Properties: Θ̂p̂Θ̂⁻¹ = −p̂, Θ̂x̂Θ̂⁻¹ = +x̂, Θ̂Ĵ Θ̂⁻¹ = −Ĵ.", height: 0.65 },
        { heading: "Θ̂²: INTEGER VS. HALF-INTEGER SPIN", body: "For integer spin (bosons, orbital only): Θ̂² = +1̂.\nFor half-integer spin (fermions, spin-1/2): Θ̂² = −1̂.\nProof for spin-1/2: Θ̂² = (iσ_yK)² = iσ_y(iσ_y)* = iσ_y·(−iσ_y) = σ_y² = ... = −1̂.", height: 0.65 },
        { heading: "KRAMERS' THEOREM", body: "If Ĥ commutes with Θ̂ and Θ̂² = −1̂, then every energy eigenvalue is at least doubly degenerate (Kramers pair). Proof: Suppose Ĥ|E⟩ = E|E⟩. Then ĤΘ̂|E⟩ = Θ̂Ĥ|E⟩ = EΘ̂|E⟩. So Θ̂|E⟩ is also an eigenstate with energy E. Crucially ⟨E|Θ̂|E⟩ = 0 (Θ̂|E⟩ ≠ |E⟩) since Θ̂² = −1̂.", height: 0.75 },
        { heading: "PHYSICAL CONSEQUENCES", body: "Kramers degeneracy in atoms: spin-orbit coupled states are doubly degenerate for odd-electron systems. In condensed matter: topological insulators protected by TRS with Θ̂² = −1. Splitting Kramers pairs requires TRS-breaking (magnetic field, magnetic impurities).", height: 0.6 }
      ],
      formula: [
        "Θ̂ = iσ_yK (spin-1/2)",
        "Θ̂²= +1̂ (integer spin)",
        "Θ̂² = −1̂ (half-integer spin)",
        "⟨E|Θ̂|E⟩ = 0 (Kramers)"
      ],
      example: [
        "Kramers pair verification for H₂ molecule (2 electrons):",
        "Time-reversal: Θ̂ = iσ_y⊗iσ_y K (both spins)",
        "Θ̂² = (−1̂)⊗(−1̂) = +1̂ (even electron count!)",
        "⟹ No Kramers degeneracy for H₂ (integer total spin)",
        "─ But H₂⁺ (1 electron): Θ̂² = −1̂ → Kramers pairs!",
        "─ Spin-1/2 energy levels always doubly degenerate if [Ĥ,Θ̂]=0"]
    }
  ],
  tierContent: [
    {
      objectives: ["Understand symmetry as 'physics looks the same'", "Describe time-reversal as running a film backwards", "Identify which operations are unitary (rotations, translations) vs. anti-unitary (time-reversal)", "Compute P̂² for a given projector matrix"],
      example: ["P̂ = |+⟩⟨+| = [[1,0],[0,0]]", "P̂² = [[1,0],[0,0]]² = [[1,0],[0,0]] = P̂ ✓", "P̂ projects onto the |+⟩ state", "Action: P̂|+⟩ = |+⟩, P̂|−⟩ = 0"],
      problems: ["P1: Verify P̂² = P̂ for P̂ = |−x⟩⟨−x|", "P2: Is rotation unitary or anti-unitary? Explain.", "P3: What does time-reversal do to a particle moving rightward?"],
      extensions: ["Connection to measurement: projectors implement quantum measurements", "Physical role of Kramers pairs in electron spin"]
    },
    {
      objectives: ["Compute P̂² = P̂ for rank-1 projectors explicitly", "Verify P̂ is Hermitian for given ket vectors", "Classify common operators as linear/unitary vs. anti-linear/anti-unitary", "Identify Θ̂² from integer/half-integer spin classification"],
      example: ["P̂ = |ψ⟩⟨ψ| where |ψ⟩ = (α,β)ᵀ, |α|²+|β|²=1", "P̂ = [[|α|², αβ*],[α*β, |β|²]]", "P̂² = P̂ (use |α|²+|β|²=1 to verify)", "P̂† = P̂ (matrix is Hermitian by construction)"],
      problems: ["P1: Verify P̂² = P̂ for |ψ⟩ = (3|+⟩+4i|−⟩)/5", "P2: Show P̂₊ + P̂₋ = 1̂ where P̂± = |±⟩⟨±|", "P3: Classify: K (conjugation), Û(θ) (rotation), e^(iĤt) — unitary or anti-unitary?"],
      extensions: ["Completeness: Σₙ P̂ₙ = 1̂ from orthonormal basis", "Connection to density matrices: ρ̂ = Σₙ pₙP̂ₙ"]
    },
    {
      objectives: ["Prove eigenvalues of any projector are exactly {0,1}", "Construct orthogonal projector decomposition of identity", "Derive ⟨ψ|P̂_φ|ψ⟩ = |⟨φ|ψ⟩|² and interpret as Born rule", "Prove Θ̂|E⟩ is orthogonal to |E⟩ when Θ̂² = −1̂"],
      example: ["Prove eigenvalues of P̂ are 0 and 1:", "P̂² = P̂ ⟹ P̂²|v⟩ = P̂|v⟩ ⟹ λ²|v⟩ = λ|v⟩", "λ(λ−1) = 0 ⟹ λ = 0 or λ = 1 □", "Eigenvectors: P̂|φ⟩ = |φ⟩ (eigenvalue 1), P̂|ψ⟩ = 0 if ⟨φ|ψ⟩=0"],
      problems: ["P1: Prove eigenvalues of any projector are {0,1}", "P2: Show ⟨ψ|P̂_φ|ψ⟩ = |⟨φ|ψ⟩|² ≥ 0 for all |ψ⟩", "P3: Prove ⟨E|Θ̂|E⟩ = 0 when Θ̂² = −1̂ (Kramers)"],
      extensions: ["Gleason's theorem: Born rule from projector algebra", "Density matrices as mixed-state extensions of pure projectors"]
    },
    {
      objectives: ["State Wigner's theorem with precise hypotheses and conclusion", "Prove that Θ̂² = ±1̂ for time-reversal depending on spin", "Apply projector algebra to compute spectral measures", "State Kramers' theorem and identify protected degeneracies"],
      example: ["Prove Θ̂² = −1̂ for spin-1/2:", "Θ̂ = iσ_y K", "Θ̂² = (iσ_yK)(iσ_yK) = iσ_y·(iσ_yK)K", "= iσ_y·i(σ_yK)K = i²σ_y·σ_y·K² = −σ_y² = −1̂ □"],
      problems: ["P1: State Wigner's theorem; identify its hypotheses and conclusion", "P2: Prove Θ̂² = +1̂ for spinless particles using Θ̂ = K", "P3: Prove Kramers' theorem: Θ̂² = −1̂ ⟹ ⟨E|Θ̂|E⟩ = 0"],
      extensions: ["Wigner's theorem and projective representations", "Berry phase and its relation to time-reversal symmetry"]
    },
    {
      objectives: ["Outline the full proof of Wigner's theorem via Uhlhorn's approach", "Classify anti-unitary representations of discrete groups", "Analyse the 10-fold way classification using TRS", "Connect Kramers pairs to topological protection in condensed matter"],
      example: ["Uhlhorn's theorem approach:", "T preserves |⟨φ|ψ⟩|² = 0 (orthogonality)", "⟹ T maps ONB to ONB", "Phase freedom used to construct Û or Θ̂", "Key: T on basis → T on all H by linearity/anti-linearity"],
      problems: ["P1: Outline Uhlhorn's theorem and its role in Wigner's proof", "P2: Classify symmetry classes in the 10-fold way using Θ̂², Ĉ²"],
      extensions: ["K-theory classification of topological insulators", "Spin-statistics theorem and its relation to time-reversal"]
    }
  ],
  pitfalls: {
    a: ["Confusing anti-linear with non-linear — anti-linear maps are still additive, just with conjugated scalar multiplication",
        "Assuming time-reversal is unitary — it cannot be: a unitary T with T Ĵ T⁻¹ = −Ĵ would require iT = −Ti, which is impossible for linear T",
        "Confusing P̂² = P̂ (projector) with P̂² = 1̂ (involutory/Hermitian reflections)"],
    b: ["Forgetting that Θ̂² = +1̂ for integer spin and Θ̂² = −1̂ for half-integer spin",
        "Applying Kramers' theorem for bosons (Θ̂² = +1̂) where it does NOT guarantee degeneracy",
        "Confusing the rank of a projector (dimension of range) with its trace (sum of eigenvalues)"],
    history: ["Wigner (1931): Gruppentheorie — symmetry theorem and proof",
              "Kramers (1930): double degeneracy for half-integer spin in time-reversal invariant systems",
              "Uhlhorn (1963): simplified proof of Wigner's theorem",
              "Kane & Mele (2005): TRS-protected topological insulators"],
    formulas: ["Anti-linear: Θ̂(α|φ⟩) = α*Θ̂|φ⟩",
               "Anti-unitary: ⟨Θ̂φ|Θ̂ψ⟩ = ⟨ψ|φ⟩",
               "Projector: P̂² = P̂, P̂† = P̂",
               "Kramers: Θ̂²=−1̂, [Ĥ,Θ̂]=0 ⟹ 2-fold deg."],
    connections: ["← L01: Projectors P̂ₙ = |aₙ⟩⟨aₙ| appear in spectral decomposition",
                  "← L02: Unitary operators form one half of Wigner's classification",
                  "→ Future: anti-unitary symmetries in topological phases; CPT theorem in QFT"]
  },
  assessmentTiers: [
    ["Problems: 3 simple + 1 advanced\nProject (~1h): Projector matrix visualiser\nProject (adv, ~2h): Time-reversal symmetry demo\nResearch: Why can time-reversal not be represented by a unitary operator?"],
    ["Problems: 4 simple + 2 advanced\nProject (~2h): Symmetry classifier for 2×2 matrices\nProject (adv, ~3h): Kramers pair finder\nResearch: Verify that Θ̂ = iσ_yK satisfies Θ̂² = −1̂ and anti-unitarity"],
    ["Problems: 3 simple + 3 advanced\nProject (~3h): Projector orthogonality verifier\nProject (adv, ~6h): Kramers degeneracy for spin-orbit Hamiltonian\nResearch: Prove Kramers' theorem from Θ̂² = −1̂ and time-reversal invariance"],
    ["Problems: 2 simple + 3 advanced\nProject (~3h): Wigner's theorem classification checker\nProject (adv, ~8h): TRS classification for the 10-fold way (simple cases)\nResearch: Wigner's theorem — statement, strategy of proof, and physical significance"],
    ["Problems: 2 simple + 3 advanced\nProject (~4h): Uhlhorn's theorem study\nProject (adv, ~15h): K-theory and topological classification\nResearch: Full proof of Wigner's theorem; connection to spin-statistics"]
  ],
  refs: {
    primary: ["Sakurai & Napolitano\nModern Quantum Mechanics\nCh. 4: Symmetries (§4.4 Time-Reversal)\n─",
              "Dirac\nPrinciples of Quantum Mechanics\nCh. 29–30: Quantum Conditions\n─",
              "Weinberg\nQuantum Theory of Fields, Vol. 1\nCh. 2: Relativistic Quantum Mechanics"],
    educational: ["Ballentine\nQuantum Mechanics: A Modern Development\nCh. 3: Kinematics and Dynamics\n─",
                  "Tung\nGroup Theory in Physics\nCh. 8: Anti-linear representations\n─",
                  "Altland & Simons\nCondensed Matter Field Theory\nCh. 9: Topological materials"],
    historical: ["Wigner (1931)\nGruppentheorie und ihre Anwendung\n↳ Original Wigner symmetry theorem\n─",
                 "Kramers (1930)\nGeneral Theory of Paramagnetic Rotation\n↳ First statement of Kramers' theorem\n─",
                 "Uhlhorn (1963)\nDarstellung der symmetrietransformationen\nArkiv för Fysik 23\n↳ Simplified Wigner theorem proof"]
  }
}

]; // end lectures array

// ═══════════════════════════════════════════════════════════
// MAIN BUILD LOOP
// ═══════════════════════════════════════════════════════════

async function buildAllLectures() {
  for (const lecture of lectures) {
    console.log(`Building ${lecture.code}: ${lecture.title}...`);
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';
    pres.title = `QM Module I.1 — ${lecture.code}: ${lecture.title}`;
    pres.author = 'QM/QC Programme — Module I.1';

    // 1. Title slide
    buildTitleSlide(pres, lecture);

    // 2. Overview slide
    buildOverviewSlide(pres, lecture);

    // 3. Dual-track slide
    buildDualTrackSlide(pres, lecture);

    // 4. Content section slides
    for (const section of lecture.sections) {
      buildContentSlide(pres, lecture, section);
    }

    // 5. One slide per tier
    TIERS.forEach((tier, i) => {
      buildTierSlide(pres, lecture, tier, lecture.tierContent[i]);
    });

    // 6. Pitfalls slide
    buildPitfallsSlide(pres, lecture);

    // 7. Assessment slide
    buildAssessmentSlide(pres, lecture);

    // 8. References slide
    buildReferencesSlide(pres, lecture);

    const fileName = `/home/claude/ModuleI1_${lecture.code}.pptx`;
    await pres.writeFile({ fileName });
    console.log(`  → Saved: ${fileName}`);
  }
  console.log('\nAll 5 lectures generated successfully!');
}

buildAllLectures().catch(console.error);
