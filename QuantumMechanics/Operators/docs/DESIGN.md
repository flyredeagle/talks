# Design System — QM Module I.1 Lecture Decks

This document describes the visual design system used across all five lecture decks, matching the reference file `assets/L01_merged_reference.pptx`.

---

## Colour Palette

### Backgrounds

| Role | Hex | Usage |
|------|-----|-------|
| `darkBg` | `#0D1B2A` | Title slides, tier slides, pitfalls, assessment, references |
| `darkBg2` | `#111D2E` | Tier slide header bar |
| `panelBg` | `#162236` | Dark content panels |
| `lightBg` | `#FFFFFF` | Content section slides, overview slide |
| `offWhite` | `#F0F4F8` | Light panel fills |

### Text

| Role | Hex | Usage |
|------|-----|-------|
| `white` | `#FFFFFF` | Primary text on dark backgrounds |
| `lightText` | `#B0C4DE` | Body text in dark panels |
| `mutedText` | `#7B8FA6` | Subtitles, footers, captions |
| `darkText` | `#1A2332` | Text on tier badge fills |
| `bodyText` | `#1E2D3D` | Body text on light backgrounds |

### Accent Colours

| Role | Hex | Usage |
|------|-----|-------|
| `accentCyan` | `#00B4D8` | Primary accent — section headers, left bars |
| `accentTeal` | `#00897B` | Secondary — Track B headers |
| `accentGold` | `#F4A261` | Worked examples, key formula headers |
| `accentGreen` | `#2ECC71` | Learning outcomes, problem sets |

### Tier Badge Colours

| Tier | Hex | Name |
|------|-----|------|
| HS | `#F4C430` | Gold |
| BegUG | `#4CAF7D` | Green |
| AdvUG | `#5B9BD5` | Blue |
| MSc | `#9B72CF` | Purple |
| PhD | `#E07B6A` | Coral |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Slide title | Cambria | 19–22pt | Bold |
| Title slide main | Cambria | 32pt | Bold |
| Section headings (panels) | Calibri | 9–9.5pt | Bold |
| Body text (dark panels) | Calibri | 9–10pt | Regular |
| Body text (light panels) | Calibri | 10pt | Regular |
| Footers | Calibri | 8pt | Regular |
| Tier badge labels | Calibri | 9–13pt | Bold |

---

## Layout — 16:9 (10" × 5.625")

### Slide Templates

#### 1. Title Slide
```
┌─────────────────────────────────────────┬──────────────────┐
│ [module label — spaced caps]            │                  │
│                                         │   ◯  Ψ symbol   │
│ [lecture code — cyan, 22pt]             │                  │
│                                         │                  │
│ [LECTURE TITLE — white bold 32pt]       │                  │
│                                         │                  │
│ [subtitle — cyan italic]                │                  │
│ [tier badges row]                       │                  │
│ [caption line]                          │                  │
└─────────────────────────────────────────┴──────────────────┘
  Background: #0D1B2A
```

#### 2. Overview Slide
```
┌──────────────────────────────────────────────────────────────┐
│ [slide title bold]                               [tag badge] │
│ [subtitle italic, muted]                                     │
├─────────────────────────────┬────────────────────────────────┤
│ 90-MIN PACING               │ CORE LEARNING OUTCOMES         │
│ [cyan left bar, offWhite bg]│ [green left bar, offWhite bg]  │
├────────┬────────┬────────┬──┴─────┬──────────────────────────┤
│   HS   │ BegUG  │ AdvUG  │  MSc   │  PhD                     │
│[badge] │[badge] │[badge] │[badge] │[badge]                   │
│[text]  │[text]  │[text]  │[text]  │[text]                    │
├────────┴────────┴────────┴────────┴──────────────────────────┤
│ ASSESSMENT BUNDLE [gold accent]                              │
└──────────────────────────────────────────────────────────────┘
  Background: #FFFFFF
```

#### 3. Content Section Slide
```
┌──────────────────────────────────────────────────────────────┐
│ [L0N — L0N.M: Section Title]                     [tag badge] │
│ [subtitle]                                                   │
├──────────────────────────────────────┬───────────────────────┤
│ ┃ HEADING 1 (cyan)                   │ KEY FORMULA           │
│ ┃ [body text]                        │ [gold accent]         │
│ ┃                                    │ [bullet items]        │
│ ┃ HEADING 2 (cyan)                   ├───────────────────────┤
│ ┃ [body text]                        │ WORKED EXAMPLE        │
│ ┃                                    │ [green accent]        │
│ ┃ HEADING 3 (cyan)                   │ [step-by-step]        │
│ ┃ [body text]                        │                       │
│ ┃ HEADING 4 (cyan)                   │                       │
│ ┃ [body text]                        │                       │
└──────────────────────────────────────┴───────────────────────┘
  Background: #FFFFFF | Left panel width: 5.7" | Right: 3.6"
```

#### 4. Tier Slide
```
┌──────────────────────────────────────────────────────────────┐
│ [TIER BADGE] [L0N — Tier Label Track]            [tag badge] │
│              [lecture title — muted italic]                  │
├────────────────────────────────┬─────────────────────────────┤
│ LEARNING OBJECTIVES            │ PROBLEM SET                 │
│ [tier colour header]           │ [green header]              │
│ [dark panel, bullet points]    │ [dark panel, bullet points] │
├────────────────────────────────┼─────────────────────────────┤
│ WORKED EXAMPLE                 │ EXTENSIONS & DEPTH          │
│ [gold header]                  │ [cyan header]               │
│ [very dark panel]              │ [very dark panel]           │
└────────────────────────────────┴─────────────────────────────┘
  Background: #0D1B2A
```

---

## Panel Styles

### Light Panel (content slides)
- Background: `#F0F4F8`
- Border: `#D0DCE8`, 1pt
- Left accent bar: 0.05" wide, accent colour
- Title: 9.5pt bold, accent colour
- Body: 10pt regular, `#1E2D3D`

### Dark Panel (tier slides)
- Background: `#162236`
- Border: `#1E3A5F`, 1.5pt
- Title: 9pt bold, varies by panel role
- Body: 9–9.5pt regular, `#B0C4DE`

### Very Dark Panel (example/extension on tier slides)
- Background: `#0A1628`
- Border: `#1E3A5F`, 1.5pt
- Title: varies
- Body: 9pt, `#B8D0E8`

---

## Slide Tag Badge (top-right corner)

Small `LXX` identifier on every slide:
- Size: 0.55" × 0.30"
- Dark slides: fill `#1E3A5F`, text `#5B9BD5`
- Light slides: fill `#E8F0F8`, text `#3A6EA5`
- Font: Calibri 8pt bold, centred

## Footer

Every slide has two footer items at y = 5.35":
- **Left**: `QM: Module I.1 — LXX`, 8pt
- **Right**: `LXX · Slide Label`, 8pt, right-aligned
- Colour: `#4A6080` (dark slides) or `#9AAABB` (light slides)

---

## Ψ Motif (Title Slides Only)

- Large circle: position (7.3", −1.0"), size 4.5" × 4.5"
- Fill: `#1B3055` at 40% transparency
- Ψ character: Cambria 120pt, colour `#1E3A6E`

---

## Source Code Structure

The generator `src/generate_lectures.js` is organised as:

```
Constants (C)          ← all hex colours
Tier definitions       ← codes, labels, badge colours
Helper functions       ← addFooter, addSlideTag, addTierBadge, addPanel, addLightPanel
Slide builders         ← buildTitleSlide, buildOverviewSlide, buildDualTrackSlide,
                          buildContentSlide, buildTierSlide, buildPitfallsSlide,
                          buildAssessmentSlide, buildReferencesSlide
Lecture data           ← lectures[] array — one object per lecture
Main build loop        ← iterates lectures[], calls builders, writes .pptx
```

To add a new lecture, add a new object to the `lectures[]` array following the schema of existing entries.
