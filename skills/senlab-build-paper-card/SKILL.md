---
name: senlab-build-paper-card
description: Build or revise a normalized SenLab paper card after ingestion. Use when Codex needs to transform a PDF and extracted text into a structured paper card with common fields, paradigm-specific sections, and Dao-Fa-Shi-Shu-Qi plus subjective ratings.
---

# SenLab Build Paper Card

Use this skill only after the paper has been ingested.

## Output Contract

Produce a normalized paper card that follows the SenLab template exactly.

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
