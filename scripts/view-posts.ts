import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://vgbibjwptrmhjthagnmd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYmliandwdHJtaGp0aGFnbm1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI1NjA2OSwiZXhwIjoyMDcwODMyMDY5fQ.tPl4tIT3bzm6ndvinhClT3oDLf5KWbXoPuoIjkDCcmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function viewPosts() {
  try {
    console.log('正在查询数据库中的文章...');
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, description, content, cover_url, status, locale')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('查询文章时出错:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('数据库中没有找到文章');
      return;
    }

    console.log(`\n找到 ${posts.length} 篇文章:\n`);
    
    posts.forEach((post, index) => {
      console.log(`--- 文章 ${index + 1} ---`);
      console.log(`ID: ${post.id}`);
      console.log(`标题: ${post.title}`);
      console.log(`描述: ${post.description || '无描述'}`);
      console.log(`状态: ${post.status}`);
      console.log(`语言: ${post.locale}`);
      console.log(`当前封面图: ${post.cover_url || '无封面图'}`);
      console.log(`内容预览: ${post.content ? post.content.substring(0, 200) + '...' : '无内容'}`);
      console.log('\n');
    });

    // 统计信息
    const withCover = posts.filter(post => post.cover_url).length;
    const withoutCover = posts.length - withCover;
    
    console.log('=== 统计信息 ===');
    console.log(`总文章数: ${posts.length}`);
    console.log(`已有封面图: ${withCover}`);
    console.log(`需要配图: ${withoutCover}`);
    
  } catch (error) {
    console.error('执行查询时出错:', error);
  }
}

// 执行查询
viewPosts();