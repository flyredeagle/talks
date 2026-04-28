"""
shared/quality_standard.py
===========================
Defines the canonical quality standard for every lecture in the
QM Bra-Ket course.  Each lecture data dict MUST conform to this schema.

Structure enforced per lecture
-------------------------------
For each of the five tiers (HS, BegUG, AdvUG, MSc, PhD):

  references:
    historical:       list[BibEntry]   – primary/original papers with annotations
    educational:      list[BibEntry]   – textbooks and lecture notes
    research:         list[BibEntry]   – advanced monographs and research articles

  concept_questions:  list[str]        – short conceptual questions (no calculation)

  problem_set_simple: list[Exercise]   – accessible computational exercises
  problem_set_advanced: list[Exercise] – multi-step derivations / proofs

  project_simple:     Project          – 1-3 hour structured project
  project_advanced:   Project          – 5-10 hour open-ended project

  research_simple:    ResearchQ        – well-defined scope, expected output stated
  research_open:      ResearchQ        – fully open frontier question

Each Exercise has:
  id, statement, hints, advanced_hints, solution

Each BibEntry has:
  authors, year, title, venue, annotation, url (optional)

Usage
-----
    from shared.quality_standard import validate_lecture, TIER_KEYS
    errors = validate_lecture(lecture_dict)
    if errors:
        for e in errors: print(e)
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional

# ── Tier identifiers (canonical order) ────────────────────────────────────────
TIER_KEYS = ["HS", "BegUG", "AdvUG", "MSc", "PhD"]

TIER_LABELS = {
    "HS":    "High School",
    "BegUG": "Beginning Undergraduate",
    "AdvUG": "Advanced Undergraduate",
    "MSc":   "Master's Level",
    "PhD":   "PhD Level",
}

# ── Data classes (for type-checked construction) ───────────────────────────────

@dataclass
class BibEntry:
    authors: str
    year: str
    title: str
    venue: str                        # journal / publisher / conference
    annotation: str                   # 1-2 sentence pedagogical note
    url: Optional[str] = None
    doi: Optional[str] = None

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}


@dataclass
class Exercise:
    id: str                           # e.g. "A1", "B3"
    statement: str                    # LaTeX-safe problem text
    hints: list[str]                  # basic hints (page 2 of packet)
    advanced_hints: list[str]         # deeper hints (page 3)
    solution: str                     # full worked solution (LaTeX-safe)
    difficulty: str = "simple"        # "simple" | "advanced"

    def to_dict(self) -> dict:
        return self.__dict__.copy()


@dataclass
class Project:
    title: str
    description: str
    deliverable: str                  # what student submits
    estimated_hours: str              # e.g. "1-3"
    tools: list[str] = field(default_factory=list)  # Python, pen+paper, etc.
    difficulty: str = "simple"

    def to_dict(self) -> dict:
        return self.__dict__.copy()


@dataclass
class ResearchQuestion:
    question: str
    scope: str                        # "well-defined" | "open"
    expected_output: Optional[str]    # for well-defined questions
    background_needed: list[str] = field(default_factory=list)
    connection_to_literature: Optional[str] = None

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}


@dataclass
class TierContent:
    tier: str
    narrative: str                    # 1-2 paragraph description of what this tier covers

    # references (3 categories)
    refs_historical: list[BibEntry]
    refs_educational: list[BibEntry]
    refs_research: list[BibEntry]

    # assessment
    concept_questions: list[str]
    problems_simple: list[Exercise]
    problems_advanced: list[Exercise]
    project_simple: Project
    project_advanced: Project
    research_simple: ResearchQuestion
    research_open: ResearchQuestion

    def to_dict(self) -> dict:
        return {
            "tier": self.tier,
            "narrative": self.narrative,
            "refs_historical":  [b.to_dict() for b in self.refs_historical],
            "refs_educational": [b.to_dict() for b in self.refs_educational],
            "refs_research":    [b.to_dict() for b in self.refs_research],
            "concept_questions": self.concept_questions,
            "problems_simple":  [p.to_dict() for p in self.problems_simple],
            "problems_advanced":[p.to_dict() for p in self.problems_advanced],
            "project_simple":   self.project_simple.to_dict(),
            "project_advanced": self.project_advanced.to_dict(),
            "research_simple":  self.research_simple.to_dict(),
            "research_open":    self.research_open.to_dict(),
        }


# ── Validation ────────────────────────────────────────────────────────────────

REQUIRED_TIER_KEYS = [
    "narrative",
    "refs_historical", "refs_educational", "refs_research",
    "concept_questions",
    "problems_simple", "problems_advanced",
    "project_simple", "project_advanced",
    "research_simple", "research_open",
]

REQUIRED_LECTURE_KEYS = [
    "num", "title", "subtitle",
    "pacing", "outcomes",
    "formulas",
    "tiers",             # dict keyed by TIER_KEYS
    "pitfalls",
    "history",
    "key_content",
]

REQUIRED_EXERCISE_KEYS = ["id", "statement", "hints", "advanced_hints", "solution"]
REQUIRED_BIB_KEYS      = ["authors", "year", "title", "venue", "annotation"]
REQUIRED_PROJECT_KEYS  = ["title", "description", "deliverable", "estimated_hours"]
REQUIRED_RESEARCH_KEYS = ["question", "scope"]


def _check_dict(obj: dict, required: list[str], path: str) -> list[str]:
    return [f"MISSING '{k}' in {path}" for k in required if k not in obj]


def validate_tier(tier_dict: dict, tier_name: str) -> list[str]:
    errors = _check_dict(tier_dict, REQUIRED_TIER_KEYS, f"tiers.{tier_name}")
    path = f"tiers.{tier_name}"

    # check each reference category
    for cat in ("refs_historical", "refs_educational", "refs_research"):
        if cat in tier_dict:
            for i, entry in enumerate(tier_dict[cat]):
                errors += _check_dict(entry, REQUIRED_BIB_KEYS, f"{path}.{cat}[{i}]")

    # check exercises
    for cat in ("problems_simple", "problems_advanced"):
        if cat in tier_dict:
            for ex in tier_dict[cat]:
                errors += _check_dict(ex, REQUIRED_EXERCISE_KEYS, f"{path}.{cat}[{ex.get('id','?')}]")

    # check projects
    for proj_key in ("project_simple", "project_advanced"):
        if proj_key in tier_dict:
            errors += _check_dict(tier_dict[proj_key], REQUIRED_PROJECT_KEYS, f"{path}.{proj_key}")

    # check research questions
    for rq_key in ("research_simple", "research_open"):
        if rq_key in tier_dict:
            errors += _check_dict(tier_dict[rq_key], REQUIRED_RESEARCH_KEYS, f"{path}.{rq_key}")

    return errors


def validate_lecture(lecture: dict) -> list[str]:
    """Return a list of error strings.  Empty list means lecture is valid."""
    errors = _check_dict(lecture, REQUIRED_LECTURE_KEYS, f"lecture.{lecture.get('num','?')}")

    if "tiers" in lecture:
        for tier in TIER_KEYS:
            if tier not in lecture["tiers"]:
                errors.append(f"MISSING tier '{tier}' in lecture.{lecture.get('num','?')}.tiers")
            else:
                errors += validate_tier(lecture["tiers"][tier], tier)

    return errors


def quality_report(lecture: dict) -> str:
    """Human-readable quality report for a lecture."""
    errors = validate_lecture(lecture)
    num = lecture.get("num", "?")
    if not errors:
        return f"✓ {num}: Quality standard PASSED — all {len(TIER_KEYS)} tiers complete."
    lines = [f"✗ {num}: Quality standard FAILED — {len(errors)} issue(s):"]
    for e in errors:
        lines.append(f"  · {e}")
    return "\n".join(lines)
