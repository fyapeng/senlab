# Ingest Paper Workflow

1. Run the database initialization script if the database does not exist.
2. Run the ingestion script with the PDF path.
3. Review the generated `work_id` and `version_id`.
4. Confirm whether the paper is a new work or a new version of an existing work.
5. Open the generated full-text file and paper card draft.
6. Complete the normalized paper card using the SenLab skill.
7. Add ratings.
8. Add high-value excerpts.
9. Add one or more citation lenses.
10. Link the paper to a precise theme when appropriate.
