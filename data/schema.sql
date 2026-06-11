CREATE TABLE IF NOT EXISTS works (
    work_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    normalized_title TEXT,
    first_author TEXT,
    year INTEGER,
    field TEXT,
    subfield TEXT,
    paper_paradigm TEXT,
    canonical_version_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paper_versions (
    version_id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL,
    source_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    fulltext_path TEXT,
    fingerprint_sha256 TEXT NOT NULL UNIQUE,
    publication_status TEXT,
    journal_or_series TEXT,
    doi TEXT,
    version_label TEXT,
    is_canonical INTEGER NOT NULL DEFAULT 0,
    supersedes_version_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(work_id)
);

CREATE TABLE IF NOT EXISTS paper_cards (
    work_id TEXT PRIMARY KEY,
    markdown_path TEXT NOT NULL,
    title TEXT,
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
    updated_at TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(work_id)
);

CREATE TABLE IF NOT EXISTS ratings (
    work_id TEXT PRIMARY KEY,
    dao INTEGER,
    fa INTEGER,
    shi INTEGER,
    shu INTEGER,
    qi INTEGER,
    subjective INTEGER,
    dao_note TEXT,
    fa_note TEXT,
    shi_note TEXT,
    shu_note TEXT,
    qi_note TEXT,
    subjective_note TEXT,
    one_line_judgment TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(work_id)
);

CREATE TABLE IF NOT EXISTS excerpts (
    excerpt_id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL,
    version_id TEXT NOT NULL,
    markdown_path TEXT NOT NULL,
    location TEXT,
    topic TEXT,
    status TEXT,
    quote_or_paraphrase TEXT,
    why_this_matters TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(work_id),
    FOREIGN KEY (version_id) REFERENCES paper_versions(version_id)
);

CREATE TABLE IF NOT EXISTS lenses (
    lens_id TEXT PRIMARY KEY,
    work_id TEXT NOT NULL,
    theme_id TEXT,
    markdown_path TEXT NOT NULL,
    lens_type TEXT NOT NULL,
    claim TEXT,
    interpretation TEXT,
    overclaim_risk TEXT,
    safer_formulation TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(work_id)
);

CREATE TABLE IF NOT EXISTS lens_excerpt_links (
    lens_id TEXT NOT NULL,
    excerpt_id TEXT NOT NULL,
    PRIMARY KEY (lens_id, excerpt_id),
    FOREIGN KEY (lens_id) REFERENCES lenses(lens_id),
    FOREIGN KEY (excerpt_id) REFERENCES excerpts(excerpt_id)
);

CREATE TABLE IF NOT EXISTS themes (
    theme_id TEXT PRIMARY KEY,
    markdown_path TEXT NOT NULL,
    name TEXT NOT NULL,
    field TEXT,
    status TEXT,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paper_theme_links (
    work_id TEXT NOT NULL,
    theme_id TEXT NOT NULL,
    PRIMARY KEY (work_id, theme_id),
    FOREIGN KEY (work_id) REFERENCES works(work_id),
    FOREIGN KEY (theme_id) REFERENCES themes(theme_id)
);
