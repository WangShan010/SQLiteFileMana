BEGIN;
CREATE TABLE
    IF
    NOT EXISTS cache ( fileName TEXT, fullPath TEXT, relativePath TEXT, buffer blob, md5 size, file_size INTEGER );
COMMIT;
