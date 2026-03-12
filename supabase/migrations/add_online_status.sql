-- 修改posts表的status字段约束，添加'online'状态
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;

-- 添加新的约束，包含'online'状态
ALTER TABLE posts ADD CONSTRAINT posts_status_check 
  CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying, 'online'::character varying]::text[]));

-- 更新现有的'published'状态文章为'online'
UPDATE posts SET status = 'online' WHERE status = 'published';