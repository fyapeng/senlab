from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "senlab.db"


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


DEMO = {
    "einav-2015-response-drug-expenditure": {
        "title": "THE RESPONSE OF DRUG EXPENDITURE TO NONLINEAR CONTRACT DESIGN: EVIDENCE FROM MEDICARE PART D*",
        "authors": "Liran Einav, Amy Finkelstein, Paul Schrimpf",
        "version_id": "einav-2015-response-drug-expenditure-uploaded",
        "field": "health-economics",
        "subfield": "applied-micro",
        "paper_paradigm": "empirical_structural",
        "publication_status": "published_version",
        "journal_or_series": "Quarterly Journal of Economics",
        "doi": "10.1093/qje/qjv005",
        "research_question": "How do Medicare Part D beneficiaries respond to nonlinear out-of-pocket drug prices created by the donut hole, and what would happen if the coverage gap were filled?",
        "why_it_matters": "The paper studies a central health-economics question: how insurance contract design shapes utilization and welfare-relevant spending behavior.",
        "core_object": "Prescription drug demand under nonlinear insurance contracts in Medicare Part D.",
        "approach": "Descriptive bunching evidence around the donut hole kink combined with a simple dynamic model of drug use and counterfactual policy analysis.",
        "main_claim": "Filling the donut hole increases annual drug spending, but a meaningful share of the response reflects anticipatory behavior and cross-year substitution rather than pure within-year moral hazard.",
        "why_in_my_db": "This paper is reusable as a policy-design reference, a nonlinear pricing case, a bunching-style empirical pattern, and a health-insurance demand benchmark.",
        "ratings": {
            "dao": 5,
            "fa": 4,
            "shi": 5,
            "shu": 5,
            "qi": 5,
            "subjective": 5,
            "dao_note": "The paper answers a first-order question about insurance design and utilization.",
            "fa_note": "The empirical logic is strong, though some interpretation depends on modeling assumptions in the counterfactual stage.",
            "shi_note": "Medicare Part D provides a rare, policy-salient nonlinear budget set with excellent variation.",
            "shu_note": "The paper combines descriptive evidence, dynamic modeling, and policy counterfactuals in a disciplined sequence.",
            "qi_note": "Its contract-design setting, empirical pattern, and policy framing are highly reusable.",
            "subjective_note": "It is directly relevant for health-economics, insurance design, and policy evaluation work.",
            "one_line_judgment": "A high-value benchmark on nonlinear insurance contracts, demand response, and policy counterfactual analysis.",
        },
        "markdown": """---
work_id: einav-2015-response-drug-expenditure
canonical_version_id: einav-2015-response-drug-expenditure-uploaded
title: THE RESPONSE OF DRUG EXPENDITURE TO NONLINEAR CONTRACT DESIGN: EVIDENCE FROM MEDICARE PART D*
authors: Liran Einav, Amy Finkelstein, Paul Schrimpf
year: 2015
publication_status: published_version
journal_or_series: Quarterly Journal of Economics
doi: 10.1093/qje/qjv005
field: health-economics
subfield: applied-micro
paper_paradigm: empirical_structural
status: seeded_demo
tags: [nonlinear-pricing, medicare-part-d, health-insurance, bunching, counterfactual]
---

# Paper Card

## Identity

- Work ID: `einav-2015-response-drug-expenditure`
- Canonical Version ID: `einav-2015-response-drug-expenditure-uploaded`

## Common Core

### Research Question
How do beneficiaries respond to nonlinear out-of-pocket prices in Medicare Part D, and how much spending would rise if the donut hole were filled?

### Why It Matters
The paper identifies how contract design affects utilization in health insurance, a core issue for both positive analysis and policy design.

### Core Object
Drug spending choices under nonlinear insurance coverage.

### Approach
The paper combines descriptive evidence around the donut hole kink with a dynamic model that quantifies responses over the full budget set.

### Main Claim
Filling the donut hole increases spending, but the gross increase partly reflects anticipatory behavior and cross-year substitution.

### Why In My Database
It is a reusable benchmark for nonlinear price response, insurance design, bunching around a contract kink, and policy counterfactual reasoning.

## Paradigm-Specific Analysis

### Empirical Branch

#### Institutional Setting
Medicare Part D creates a nonlinear coverage schedule with a well-known donut hole where marginal prices rise sharply.

#### Data Source
Detailed microdata from a 20 percent random sample of Medicare Part D beneficiaries from 2007 to 2009.

#### Unit of Observation
Individual beneficiaries and their prescription-drug claims over the plan year.

#### Sample
Medicare Part D enrollees with observed contract characteristics and claims histories.

#### Outcome Variables
Annual drug spending, claim timing, and spending behavior around the donut hole threshold.

#### Treatment Or Variation
The key variation comes from the nonlinear contract and the discontinuous change in generosity at the coverage-gap kink.

#### Identification Logic
The descriptive evidence uses excess mass and claim-timing behavior around the kink; the structural component maps these responses into counterfactual spending effects.

#### Main Results
In the baseline model, filling the donut hole raises annual drug spending by roughly $150, around 8 percent.

#### Mechanism Evidence
The timing patterns suggest anticipatory behavior within the year, and the extension indicates an important role for cross-year substitution.

#### Counterfactual Or Policy Exercise
The paper studies the spending effects of closing the donut hole, as required under the Affordable Care Act.

### Theory Branch

#### Players
Not the primary branch for this paper.

## Limitations
The counterfactual magnitudes depend on the dynamic specification, and the cross-year substitution extension is intentionally stylized.

## Theme Links
- `nonlinear-insurance-contracts`
- `drug-demand-under-insurance`

## Ratings

### Dao
- Score: 5
- Note: The question is policy-relevant and conceptually central for insurance design.

### Fa
- Score: 4
- Note: The descriptive evidence is strong, though some conclusions depend on model structure.

### Shi
- Score: 5
- Note: The institutional setting provides unusually strong leverage.

### Shu
- Score: 5
- Note: The paper executes the empirical and model-based parts with discipline.

### Qi
- Score: 5
- Note: The setting, data logic, and contract design are highly reusable.

### Subjective
- Score: 5
- Note: It is directly useful for health-economics and policy-evaluation work.

### One-Line Judgment
A benchmark paper on nonlinear insurance contracts and counterfactual health-policy analysis.

## TODO_VERIFY
- Confirm exact sample construction details from the body of the paper.
- Confirm whether the uploaded PDF is the final published formatting or a post-processed copy.
""",
        "excerpts": [
            {
                "excerpt_id": "einav-2015-response-drug-expenditure-ex-001",
                "location": "Abstract",
                "topic": "counterfactual",
                "status": "seeded_demo",
                "quote_or_paraphrase": "The baseline model implies that filling the donut hole raises annual drug spending by about $150, or about 8 percent.",
                "why_this_matters": "This is the headline quantitative policy result and anchors later citation lenses.",
            },
            {
                "excerpt_id": "einav-2015-response-drug-expenditure-ex-002",
                "location": "Introduction",
                "topic": "identification_logic",
                "status": "seeded_demo",
                "quote_or_paraphrase": "The paper exploits the kink created by the donut hole to document excess mass and changes in claim timing around the threshold.",
                "why_this_matters": "This excerpt captures the empirical logic behind the descriptive response evidence.",
            },
        ],
        "lenses": [
            {
                "lens_id": "einav-2015-response-drug-expenditure-lens-policy",
                "theme_id": "nonlinear-insurance-contracts",
                "lens_type": "policy",
                "claim": "Nonlinear insurance contracts can meaningfully distort the timing and level of medical spending.",
                "interpretation": "Use the paper as evidence that beneficiaries respond to sharp changes in marginal price created by coverage design.",
                "overclaim_risk": "Do not generalize the exact magnitude outside the Medicare Part D institutional setting.",
                "safer_formulation": "In Medicare Part D, beneficiaries exhibit economically meaningful responses to the donut-hole price increase.",
                "excerpt_ids": [
                    "einav-2015-response-drug-expenditure-ex-001",
                    "einav-2015-response-drug-expenditure-ex-002",
                ],
            },
            {
                "lens_id": "einav-2015-response-drug-expenditure-lens-method",
                "theme_id": "nonlinear-insurance-contracts",
                "lens_type": "method",
                "claim": "Bunching and claim timing around a contract kink can reveal behavioral response to nonlinear prices.",
                "interpretation": "Use the paper as a case of extracting demand information from nonlinear budget sets and administrative timing data.",
                "overclaim_risk": "The paper is not a generic reduced-form bunching design; its structural layer matters for some conclusions.",
                "safer_formulation": "The paper shows how descriptive kink evidence can be combined with a dynamic model to study nonlinear price response.",
                "excerpt_ids": [
                    "einav-2015-response-drug-expenditure-ex-002",
                ],
            },
        ],
        "themes": [
            ("nonlinear-insurance-contracts", "Nonlinear Insurance Contracts", "health-economics"),
            ("drug-demand-under-insurance", "Drug Demand Under Insurance", "health-economics"),
        ],
    },
    "kamenica-2011-bayesian-persuasion": {
        "title": "Bayesian Persuasion",
        "authors": "Emir Kamenica and Matthew Gentzkow",
        "version_id": "kamenica-2011-bayesian-persuasion-uploaded",
        "field": "microeconomic-theory",
        "subfield": "information-design",
        "paper_paradigm": "theory",
        "publication_status": "published_version",
        "journal_or_series": "American Economic Review",
        "doi": "10.1257/aer.101.6.2590",
        "research_question": "When can a sender profitably persuade a rational Bayesian receiver by choosing the receiver's information structure?",
        "why_it_matters": "The paper creates the canonical information-design framework behind modern persuasion theory in economics.",
        "core_object": "Strategic design of signals in a symmetric-information sender-receiver setting.",
        "approach": "General sender-receiver model with arbitrary states and actions, reformulated as an optimization over posterior distributions.",
        "main_claim": "A sender can often benefit from persuasion even when the receiver understands the sender's motives, and optimal persuasion can be characterized through feasible posterior beliefs.",
        "why_in_my_db": "This is a core theory reference for information design, mechanism intuition, and research migration across political economy, marketing, law, and platform settings.",
        "ratings": {
            "dao": 5,
            "fa": 5,
            "shi": 4,
            "shu": 5,
            "qi": 5,
            "subjective": 4,
            "dao_note": "The paper asks a foundational question about strategic information transmission.",
            "fa_note": "The model logic is clean and the posterior reformulation is internally powerful.",
            "shi_note": "It launched a major research direction, though its value depends less on one empirical window than on conceptual generality.",
            "shu_note": "The execution is elegant and the examples are disciplined.",
            "qi_note": "The framework is extremely reusable across many fields.",
            "subjective_note": "It is highly useful when theory or mechanism framing matters, though not every applied project will need it directly.",
            "one_line_judgment": "A canonical information-design paper with broad reusable value across theory and applied mechanism work.",
        },
        "markdown": """---
work_id: kamenica-2011-bayesian-persuasion
canonical_version_id: kamenica-2011-bayesian-persuasion-uploaded
title: Bayesian Persuasion
authors: Emir Kamenica and Matthew Gentzkow
year: 2011
publication_status: published_version
journal_or_series: American Economic Review
doi: 10.1257/aer.101.6.2590
field: microeconomic-theory
subfield: information-design
paper_paradigm: theory
status: seeded_demo
tags: [information-design, persuasion, sender-receiver, posterior-beliefs, mechanism]
---

# Paper Card

## Identity

- Work ID: `kamenica-2011-bayesian-persuasion`
- Canonical Version ID: `kamenica-2011-bayesian-persuasion-uploaded`

## Common Core

### Research Question
When can a sender manipulate a receiver's action by optimally designing the information she sees?

### Why It Matters
The paper establishes the baseline theory of information design and persuasion with rational Bayesian receivers.

### Core Object
Signal design in a sender-receiver game with common priors and conflicting preferences.

### Approach
The paper reformulates the sender's problem as a search over posterior distributions whose expectation equals the prior.

### Main Claim
Even with full awareness of the sender's motives, a Bayesian receiver can be profitably persuaded through the sender's choice of signal structure.

### Why In My Database
It is a canonical theory anchor for information design, mechanism intuition, and theme-building across many subfields.

## Paradigm-Specific Analysis

### Theory Branch

#### Players
A sender who chooses a signal structure and a receiver who takes an action after observing a signal realization.

#### State Space
An arbitrary state space with a common prior shared by sender and receiver.

#### Action Space
An arbitrary action space available to the receiver after she updates beliefs.

#### Information Structure
The sender chooses an experiment or signal that induces posterior beliefs over the state.

#### Timing
The state is drawn, the sender commits to an information structure, the receiver observes the signal realization, and then acts.

#### Objective Functions
The sender and receiver have state-dependent preferences over the receiver's action.

#### Solution Concept
Optimal persuasion is characterized as an optimization over feasible distributions of posterior beliefs satisfying Bayes plausibility.

#### Key Propositions
The existence of beneficial persuasion and the sender-optimal signal can be characterized through the geometry of posterior distributions.

#### Conditions
The sender cannot lie about realized signals once the signal structure is chosen.

#### Comparative Statics
The value of persuasion depends on the alignment of sender and receiver preferences and the curvature of the sender's value function over beliefs.

#### Applications
The paper discusses litigators, lobbyists, salespeople, and broader strategic communication environments.

### Empirical Branch

#### Institutional Setting
Not the primary branch for this paper.

## Limitations
The model abstracts from ex post lying, richer dynamic communication, and some incentive-compatibility issues emphasized in other communication models.

## Theme Links
- `information-design-persuasion`
- `strategic-communication`

## Ratings

### Dao
- Score: 5
- Note: The question is foundational and field-defining.

### Fa
- Score: 5
- Note: The model logic and posterior reformulation are exceptionally clean.

### Shi
- Score: 4
- Note: Its value comes from conceptual reach more than one institutional opportunity.

### Shu
- Score: 5
- Note: The execution is elegant and highly disciplined.

### Qi
- Score: 5
- Note: The framework is broadly reusable across many settings.

### Subjective
- Score: 4
- Note: It is especially valuable when theory and mechanism framing matter.

### One-Line Judgment
A canonical information-design framework with unusually high long-run reuse value.

## TODO_VERIFY
- Confirm whether the uploaded PDF is the final AER version or a mirrored copy.
""",
        "excerpts": [
            {
                "excerpt_id": "kamenica-2011-bayesian-persuasion-ex-001",
                "location": "Abstract",
                "topic": "core_claim",
                "status": "seeded_demo",
                "quote_or_paraphrase": "A sender can strictly benefit from choosing the receiver's information structure even when the receiver is fully rational and aware of the sender's motives.",
                "why_this_matters": "This is the canonical high-level claim of Bayesian persuasion.",
            },
            {
                "excerpt_id": "kamenica-2011-bayesian-persuasion-ex-002",
                "location": "Introduction",
                "topic": "method",
                "status": "seeded_demo",
                "quote_or_paraphrase": "The sender's problem can be reformulated as a search over posterior belief distributions whose expectation equals the prior.",
                "why_this_matters": "This is the key geometric insight that made the framework portable and powerful.",
            },
        ],
        "lenses": [
            {
                "lens_id": "kamenica-2011-bayesian-persuasion-lens-theory",
                "theme_id": "information-design-persuasion",
                "lens_type": "theory",
                "claim": "Strategic control of information can change actions even without changing preferences or making transfers.",
                "interpretation": "Use the paper as the canonical theory reference for information-design-based persuasion.",
                "overclaim_risk": "Do not confuse persuasion through experiment design with cheap talk or ex post deception models.",
                "safer_formulation": "In the Bayesian persuasion framework, a sender can benefit by choosing an information structure that shifts receiver posteriors.",
                "excerpt_ids": [
                    "kamenica-2011-bayesian-persuasion-ex-001",
                    "kamenica-2011-bayesian-persuasion-ex-002",
                ],
            },
            {
                "lens_id": "kamenica-2011-bayesian-persuasion-lens-opportunity",
                "theme_id": "strategic-communication",
                "lens_type": "opportunity",
                "claim": "The framework offers a reusable template for importing information design into applied institutional settings.",
                "interpretation": "Use the paper when generating new questions about disclosure, recommendation systems, litigation, or regulated information environments.",
                "overclaim_risk": "The paper is a framework paper, not direct evidence about any one empirical institution.",
                "safer_formulation": "The paper provides a tractable theory template that can be adapted to applied settings where agents control informational environments.",
                "excerpt_ids": [
                    "kamenica-2011-bayesian-persuasion-ex-002",
                ],
            },
        ],
        "themes": [
            ("information-design-persuasion", "Information Design and Persuasion", "microeconomic-theory"),
            ("strategic-communication", "Strategic Communication", "microeconomic-theory"),
        ],
    },
}


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def upsert_theme(conn: sqlite3.Connection, theme_id: str, name: str, field: str) -> None:
    timestamp = now()
    markdown_path = ROOT / "canonical" / "themes" / f"{theme_id}.md"
    if not markdown_path.exists():
        write_text(
            markdown_path,
            f"""---
theme_id: {theme_id}
name: {name}
field: {field}
status: seeded_demo
---

# Theme

## Core Question

## Why This Theme Matters

## Key Papers

## Common Lenses

## Open Gaps

## Related Opportunities

## TODO_VERIFY
""",
        )
    conn.execute(
        """
        INSERT INTO themes (theme_id, markdown_path, name, field, status, updated_at)
        VALUES (?, ?, ?, ?, 'seeded_demo', ?)
        ON CONFLICT(theme_id) DO UPDATE SET
            markdown_path=excluded.markdown_path,
            name=excluded.name,
            field=excluded.field,
            status=excluded.status,
            updated_at=excluded.updated_at
        """,
        (theme_id, str(markdown_path), name, field, timestamp),
    )


def seed_work(conn: sqlite3.Connection, work_id: str, payload: dict) -> None:
    timestamp = now()
    card_path = ROOT / "canonical" / "papers" / f"{work_id}.md"
    if not card_path.exists():
        write_text(card_path, payload["markdown"])

    work_exists = conn.execute("SELECT 1 FROM works WHERE work_id=?", (work_id,)).fetchone()
    version_exists = conn.execute("SELECT 1 FROM paper_versions WHERE version_id=?", (payload["version_id"],)).fetchone()
    if not work_exists or not version_exists:
        raise RuntimeError(
            f"Missing ingested record for {work_id}. Run ingest_paper.py for the corresponding PDF before seeding demo content."
        )

    conn.execute(
        """
        UPDATE works
        SET title=?, field=?, subfield=?, paper_paradigm=?, canonical_version_id=?, updated_at=?
        WHERE work_id=?
        """,
        (
            payload["title"],
            payload["field"],
            payload["subfield"],
            payload["paper_paradigm"],
            payload["version_id"],
            timestamp,
            work_id,
        ),
    )
    conn.execute(
        """
        UPDATE paper_versions
        SET publication_status=?, journal_or_series=?, doi=?, version_label='published-demo',
            is_canonical=1, updated_at=?
        WHERE version_id=?
        """,
        (
            payload["publication_status"],
            payload["journal_or_series"],
            payload["doi"],
            timestamp,
            payload["version_id"],
        ),
    )
    conn.execute(
        """
        UPDATE paper_cards
        SET markdown_path=?, title=?, authors=?,
            publication_status=?, journal_or_series=?, doi=?, field=?, subfield=?, paper_paradigm=?,
            research_question=?, why_it_matters=?, core_object=?, approach=?, main_claim=?, why_in_my_db=?, updated_at=?
        WHERE work_id=?
        """,
        (
            str(card_path),
            payload["title"],
            payload["authors"],
            payload["publication_status"],
            payload["journal_or_series"],
            payload["doi"],
            payload["field"],
            payload["subfield"],
            payload["paper_paradigm"],
            payload["research_question"],
            payload["why_it_matters"],
            payload["core_object"],
            payload["approach"],
            payload["main_claim"],
            payload["why_in_my_db"],
            timestamp,
            work_id,
        ),
    )
    ratings = payload["ratings"]
    conn.execute(
        """
        UPDATE ratings
        SET dao=?, fa=?, shi=?, shu=?, qi=?, subjective=?,
            dao_note=?, fa_note=?, shi_note=?, shu_note=?, qi_note=?, subjective_note=?,
            one_line_judgment=?, updated_at=?
        WHERE work_id=?
        """,
        (
            ratings["dao"], ratings["fa"], ratings["shi"], ratings["shu"], ratings["qi"], ratings["subjective"],
            ratings["dao_note"], ratings["fa_note"], ratings["shi_note"], ratings["shu_note"], ratings["qi_note"],
            ratings["subjective_note"], ratings["one_line_judgment"], timestamp, work_id,
        ),
    )

    for theme_id, name, field in payload["themes"]:
        upsert_theme(conn, theme_id, name, field)
        conn.execute(
            """
            INSERT OR REPLACE INTO paper_theme_links (work_id, theme_id)
            VALUES (?, ?)
            """,
            (work_id, theme_id),
        )

    for excerpt in payload["excerpts"]:
        excerpt_path = ROOT / "canonical" / "excerpts" / f"{excerpt['excerpt_id']}.md"
        if not excerpt_path.exists():
            write_text(
                excerpt_path,
                f"""---
excerpt_id: {excerpt['excerpt_id']}
work_id: {work_id}
version_id: {payload['version_id']}
location: {excerpt['location']}
topic: {excerpt['topic']}
status: {excerpt['status']}
---

# Excerpt

## Location
{excerpt['location']}

## Quote Or Paraphrase
{excerpt['quote_or_paraphrase']}

## Why This Matters
{excerpt['why_this_matters']}

## Related Lenses

## TODO_VERIFY
""",
            )
        conn.execute(
            """
            INSERT OR REPLACE INTO excerpts (
                excerpt_id, work_id, version_id, markdown_path, location, topic, status,
                quote_or_paraphrase, why_this_matters, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                excerpt["excerpt_id"],
                work_id,
                payload["version_id"],
                str(excerpt_path),
                excerpt["location"],
                excerpt["topic"],
                excerpt["status"],
                excerpt["quote_or_paraphrase"],
                excerpt["why_this_matters"],
                timestamp,
            ),
        )

    for lens in payload["lenses"]:
        lens_path = ROOT / "canonical" / "lenses" / f"{lens['lens_id']}.md"
        if not lens_path.exists():
            write_text(
                lens_path,
                f"""---
lens_id: {lens['lens_id']}
work_id: {work_id}
theme_id: {lens['theme_id']}
lens_type: {lens['lens_type']}
status: seeded_demo
---

# Citation Lens

## Why I Am Using This Paper Here
{lens['interpretation']}

## Claim I Want To Support
{lens['claim']}

## Evidence Excerpts
{", ".join(lens['excerpt_ids'])}

## My Interpretation
{lens['interpretation']}

## Overclaim Risk
{lens['overclaim_risk']}

## Safer Formulation
{lens['safer_formulation']}

## Related Themes
{lens['theme_id']}

## TODO_VERIFY
""",
            )
        conn.execute(
            """
            INSERT OR REPLACE INTO lenses (
                lens_id, work_id, theme_id, markdown_path, lens_type, claim, interpretation,
                overclaim_risk, safer_formulation, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                lens["lens_id"],
                work_id,
                lens["theme_id"],
                str(lens_path),
                lens["lens_type"],
                lens["claim"],
                lens["interpretation"],
                lens["overclaim_risk"],
                lens["safer_formulation"],
                timestamp,
            ),
        )
        conn.execute("DELETE FROM lens_excerpt_links WHERE lens_id=?", (lens["lens_id"],))
        for excerpt_id in lens["excerpt_ids"]:
            conn.execute(
                "INSERT OR REPLACE INTO lens_excerpt_links (lens_id, excerpt_id) VALUES (?, ?)",
                (lens["lens_id"], excerpt_id),
            )


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"Database not found: {DB_PATH}. Run scripts/init_db.py and ingest papers first.")
    with sqlite3.connect(DB_PATH) as conn:
        for work_id, payload in DEMO.items():
            seed_work(conn, work_id, payload)
        conn.commit()
    print("Seeded demo content into database and canonical markdown files.")


if __name__ == "__main__":
    main()
