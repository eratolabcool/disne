-- ============================================================================
-- Posts 表结构（Neon PostgreSQL 版本）
-- ============================================================================
-- 用途：存储 SEO 文章和博客内容
-- 替代：Supabase posts 表
-- ============================================================================

CREATE TABLE IF NOT EXISTS posts (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  status VARCHAR(50) DEFAULT 'created',
  locale VARCHAR(10) DEFAULT 'en',
  cover_url VARCHAR(500),
  author_name VARCHAR(255),
  author_avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_locale ON posts(locale);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_locale_status ON posts(locale, status, created_at DESC);

-- 添加注释
COMMENT ON TABLE posts IS 'SEO 文章和博客内容表';
COMMENT ON COLUMN posts.uuid IS '唯一标识符';
COMMENT ON COLUMN posts.slug IS 'URL 友好的唯一标识符';
COMMENT ON COLUMN posts.status IS '文章状态: created, online, offline, deleted';
COMMENT ON COLUMN posts.locale IS '语言代码: en, zh, ja, es, de, pt';
