CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS papers (
    work_id TEXT PRIMARY KEY,
    canonical_version_id TEXT,
    title TEXT NOT NULL,
    authors TEXT,
    year INTEGER,
    publication_status TEXT,
    journal_or_series TEXT,
    doi TEXT,
    field TEXT,
    subfield TEXT,
    paper_paradigm TEXT,
    research_question TEXT,
    why_it_matters TEXT,
    core_object TEXT,
    approach TEXT,
    main_claim TEXT,
    why_in_my_db TEXT,
    one_line_judgment TEXT,
    ratings_json TEXT NOT NULL,
    rating_notes_json TEXT NOT NULL,
    sections_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS themes (
    theme_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    field TEXT
);

CREATE TABLE IF NOT EXISTS paper_themes (
    work_id TEXT NOT NULL,
    theme_id TEXT NOT NULL,
    PRIMARY KEY (work_id, theme_id)
);

CREATE TABLE IF NOT EXISTS topics (
    topic_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    topic_group TEXT
);

CREATE TABLE IF NOT EXISTS paper_topics (
    work_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    PRIMARY KEY (work_id, topic_id)
);

CREATE TABLE IF NOT EXISTS citations (
    citation_id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL,
    version_id TEXT,
    primary_theme_id TEXT,
    point_type TEXT NOT NULL,
    title TEXT NOT NULL,
    claim TEXT,
    interpretation TEXT,
    use_when TEXT,
    boundary TEXT,
    safer_formulation TEXT,
    source_locator TEXT,
    keywords_json TEXT NOT NULL,
    evidence_excerpt_ids_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS citation_topics (
    citation_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    PRIMARY KEY (citation_id, topic_id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS citation_fts USING fts5(
    citation_id UNINDEXED,
    title,
    claim,
    interpretation,
    use_when,
    boundary,
    safer_formulation,
    keywords,
    paper_title,
    tokenize='trigram'
);

CREATE INDEX IF NOT EXISTS idx_papers_year ON papers(year);
CREATE INDEX IF NOT EXISTS idx_papers_field ON papers(field);
CREATE INDEX IF NOT EXISTS idx_papers_paradigm ON papers(paper_paradigm);
CREATE INDEX IF NOT EXISTS idx_paper_themes_theme ON paper_themes(theme_id);
CREATE INDEX IF NOT EXISTS idx_paper_topics_topic ON paper_topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_citations_work ON citations(work_id);
CREATE INDEX IF NOT EXISTS idx_citations_type ON citations(point_type);
CREATE INDEX IF NOT EXISTS idx_citations_theme ON citations(primary_theme_id);
CREATE INDEX IF NOT EXISTS idx_citation_topics_topic ON citation_topics(topic_id);
