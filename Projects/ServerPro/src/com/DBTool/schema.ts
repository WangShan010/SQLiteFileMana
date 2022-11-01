let schema = `
BEGIN;

CREATE TABLE IF NOT EXISTS file_info (
    file_gid INTEGER PRIMARY KEY,
    file_name TEXT,
    file_path TEXT,
    file_size real,
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
CREATE INDEX IF NOT EXISTS file_info_md5 ON file_info (file_md5);
CREATE UNIQUE INDEX IF NOT EXISTS file_data_id ON file_data (file_md5);
CREATE UNIQUE INDEX IF NOT EXISTS name ON metadata (name);


-- ----------------------------
-- 数据汇总视图表
-- ----------------------------
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
    LEFT JOIN file_data ON file_data.file_md5 = file_info.file_md5;


-- ----------------------------
-- 文件数据悬空视图表
-- ----------------------------
CREATE VIEW IF NOT EXISTS file_deleted AS
    SELECT file_data.file_md5
        FROM file_data
        LEFT JOIN file_info ON file_data.file_md5 = file_info.file_md5
    WHERE file_info.file_gid ISNULL;


-- ----------------------------
-- ① 文件信息表 插入触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_info_insert"
BEFORE INSERT
ON "file_info"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;


-- ----------------------------
-- ② 文件信息表 更新触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_info_update"
BEFORE UPDATE OF "file_gid", "file_name", "file_path", "file_size", "file_zip", "file_md5"
ON "file_info"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;


-- ----------------------------
-- ③ 文件信息表 删除触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_info_delete"
BEFORE DELETE
ON "file_info"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;


-- ----------------------------
-- ① 文件存储表 插入触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_data_insert"
BEFORE INSERT
ON "file_data"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;


-- ----------------------------
-- ② 文件存储表 更新触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_data_update"
BEFORE UPDATE OF "file_md5", "file_data"
ON "file_data"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;


-- ----------------------------
-- ③ 文件存储表 删除触发器
-- ----------------------------
CREATE TRIGGER IF NOT EXISTS "trigger_file_data_delete"
BEFORE DELETE
ON "file_data"
BEGIN
 update metadata set value = '0' where name = 'fileCount';
 update metadata set value = '0' where name = 'totalSize';
 update metadata set value = null where name = 'directoryIndex';
 update metadata set value = null where name = 'updateTime';
END;



COMMIT;
`;


export = schema;
