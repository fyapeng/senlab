---
name: senlab-build-paper-card
description: Build or revise a normalized SenLab paper card after ingestion. Use when Codex needs to transform a PDF and extracted text into a structured paper card with common fields, paradigm-specific sections, and Dao-Fa-Shi-Shu-Qi plus subjective ratings.
---

# SenLab Build Paper Card

Use this skill only after the paper has been ingested.

## Output Contract

Produce a normalized paper card that follows the SenLab template exactly.

Write all analytical fields in Chinese by default. Keep original-language values only for:

- title
- authors
- journal or series names
- DOI
- technical terms that are substantially clearer in English

For original-language metadata, standardize to publication-style English rather than raw PDF extraction:

- convert all-caps titles to normal title case
- remove trailing footnote stars such as `*`
- remove OCR line-break artifacts and duplicated spaces
- keep author names in normal English capitalization
- do not preserve PDF typography noise as canonical metadata

## Common Fields

Always complete:

- research_question
- why_it_matters
- core_object
- approach
- main_claim
- why_in_my_db

## Paradigm Branches

### Empirical

Complete:

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

### Theory

Complete:

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

## Ratings

Use integer scores 1 to 5 only for:

- dao
- fa
- shi
- shu
- qi
- subjective

Add one short justification sentence for each score.

## Quality Bar

- Distinguish author claims from your interpretation.
- Do not invent facts absent from the paper.
- Mark uncertain metadata or claims as `TODO_VERIFY`.
- Prefer Chinese field content that reads naturally on the public website rather than raw translation fragments.
- If publication metadata and PDF OCR conflict, prefer the verified publication-style title, author list, and journal formatting.
- If the extracted full text is only a placeholder, extraction error note, or obviously incomplete, stop and send the paper back to the ingestion stage instead of drafting a false-complete card.
