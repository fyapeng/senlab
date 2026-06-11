---
name: senlab-paper-workflow
description: Ingest academic papers into the SenLab local research database with strict, standardized outputs. Use when Codex needs to process a paper PDF into SenLab objects, including work/version identification, extracted full text, a normalized paper card, Dao-Fa-Shi-Shu-Qi plus subjective ratings, excerpts, citation lenses, and theme links. Use for paper intake, version updates, structured markdown generation, lens drafting, and database-backed research-note maintenance.
---

# SenLab Paper Workflow

Follow this skill only for SenLab database work. Do not use it for free-form paper summaries, blog articles, or loose deep-reading notes.

## Output Contract

Produce or update the following SenLab objects for each paper:

1. One `work` identity.
2. One `paper_version` identity.
3. One extracted full-text markdown file.
4. One normalized paper card markdown file.
5. Zero or more excerpt markdown files.
6. One or more citation lens markdown files when the paper has identifiable reusable functions.
7. One database update through the project ingestion scripts when possible.

Keep outputs deterministic and template-driven. Do not invent fields. Leave unknown fields blank or mark them as `TODO_VERIFY`.

## Identity Rules

- Treat `work_id` as the stable identity of the research work.
- Treat `version_id` as the specific PDF version identity.
- Do not delete older versions when a published version appears.
- Mark older versions as superseded in the database or metadata instead of removing them.
- Prefer the published version as canonical when publication metadata is confirmed.

## Mandatory Workflow

### 1. Identify the paper mode

Choose one:

- `empirical_reduced_form`
- `empirical_structural`
- `theory`
- `econometrics`
- `review`
- `mixed`

This choice controls which sections deserve detail, but never changes the top-level template.

### 2. Ingest deterministically first

Use the SenLab scripts before drafting analysis:

- initialize or migrate the SQLite database if needed
- ingest the PDF into the workspace structure
- extract metadata and full text
- create a draft paper card if one does not already exist

If deterministic ingestion fails, report the failure precisely and continue only with clearly marked manual placeholders.

### 3. Fill the normalized paper card

Always complete the common fields:

- title
- authors
- year
- publication_status
- journal_or_series
- doi
- field
- subfield
- paper_paradigm
- research_question
- why_it_matters
- core_object
- approach
- main_claim
- why_in_my_db

Then complete the paradigm-specific sections.

For empirical papers, emphasize:

- institutional_setting
- data_source
- unit_of_observation
- sample
- outcome_variables
- treatment_or_variation
- identification_logic
- main_results
- mechanism_evidence
- counterfactual_or_policy_exercise
- limitations

For theory papers, emphasize:

- players
- state_space
- action_space
- information_structure
- timing
- objective_functions
- solution_concept
- key_propositions
- conditions
- comparative_statics
- applications
- limitations

### 4. Rate with the fixed 5+1 framework

Every paper card must contain the following ratings:

- `dao`
- `fa`
- `shi`
- `shu`
- `qi`
- `subjective`

Use integers from 1 to 5 only.

Interpret them as:

- `dao`: importance and depth of the research question
- `fa`: credibility of identification, theory, or argumentative logic
- `shi`: strength of institutional, historical, data, or literature opportunity
- `shu`: quality of execution
- `qi`: reusability of data, model, design, setting, or research instrument
- `subjective`: usefulness for the user's own research agenda

Add one short justification sentence for each dimension. Do not collapse them into a single total score.

### 5. Draft excerpts

Extract only high-value evidence blocks. Favor:

- research-question statements
- key assumptions
- identification logic
- theorem or proposition statements
- main empirical result descriptions
- mechanism or counterfactual claims
- explicit limitations

Every excerpt must include a location reference.

### 6. Draft citation lenses

Citation lenses are required when the paper is reusable for future writing, argumentation, or theme construction.

Use one of these `lens_type` values only:

- `fact`
- `mechanism`
- `method`
- `data`
- `theory`
- `policy`
- `counterfactual`
- `opportunity`

For each lens, answer:

- why the paper is being used here
- which claim is supported
- which excerpt(s) support the claim
- whether there is an overclaim risk
- what the safer formulation is

Do not create vague or generic lenses.

### 7. Link to themes

Add theme links only when a theme is genuinely identified. Do not fabricate broad themes. Prefer a small number of precise theme links.

## File Discipline

- Keep canonical objects in `E:\SenLab\canonical\...`.
- Keep extracted text in `E:\SenLab\library\fulltext\`.
- Keep PDFs under the work/version path chosen by the ingestion script.
- Do not write free-form summaries into canonical files.
- Put speculative thoughts in `scratch\` only.

## Validation Checklist

Before finishing, verify:

1. `work_id` and `version_id` exist and are consistent.
2. The PDF is stored in the canonical library path.
3. The paper card follows the exact template.
4. Ratings use integers 1-5.
5. Every citation lens points to specific evidence.
6. Unknown facts are marked `TODO_VERIFY` rather than guessed.
