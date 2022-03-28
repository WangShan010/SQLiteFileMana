-- MBTiles schema
BEGIN;

CREATE TABLE IF NOT EXISTS file_info (
    file_gid INTEGER PRIMARY KEY,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    file_zip TEXT,
    file_md5 TEXT,
    UNIQUE (file_name, file_path)
);


CREATE TABLE IF NOT EXISTS file_data (
    file_md5 text,
    file_data blob,
    PRIMARY KEY (file_md5)
);


CREATE TABLE IF NOT EXISTS metadata (
    name text,
    value text
);

CREATE UNIQUE INDEX IF NOT EXISTS file_info_id ON file_info (file_gid);
CREATE INDEX IF NOT EXISTS file_info_name ON file_info (file_name);
CREATE INDEX IF NOT EXISTS file_info_path ON file_info (file_path);
CREATE INDEX IF NOT EXISTS file_info_size ON file_info (file_size);
CREATE UNIQUE INDEX IF NOT EXISTS file_data_id ON file_data (file_md5);
CREATE UNIQUE INDEX IF NOT EXISTS name ON metadata (name);

CREATE VIEW IF NOT EXISTS file_list AS
    SELECT
        file_info.file_gid AS file_gid,
        file_info.file_name AS file_name,
        file_info.file_path AS file_path,
        file_info.file_path || file_info.file_name as file_full_path,
        file_info.file_zip AS file_zip,
        file_info.file_size AS file_size,
        file_info.file_md5 AS file_md5,
        file_data.file_data AS file_data
    FROM file_info
    JOIN file_data ON file_data.file_md5 = file_info.file_md5;

COMMIT;
