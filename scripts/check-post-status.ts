import { config } from 'dotenv';
import { getSupabaseClient } from '../models/db';
import { PostStatus } from '../models/post';

// 加载环境变量
config();

// 检查数据库中所有文章的状态分布
export async function checkPostStatus() {
  const supabase = getSupabaseClient();
  
  try {
    // 获取所有文章
    const { data: posts, error } = await supabase
      .from('posts')
      .select('uuid, title, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取文章数据失败:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('数据库中没有找到任何文章');
      return;
    }

    // 统计各状态的文章数量
    const statusCount = {
      [PostStatus.Created]: 0,
      [PostStatus.Deleted]: 0,
      [PostStatus.Online]: 0,
      [PostStatus.Offline]: 0,
      'other': 0
    };

    console.log('\n=== 文章状态检查报告 ===');
    console.log(`总文章数: ${posts.length}`);
    console.log('\n文章详情:');
    
    posts.forEach((post, index) => {
      const status = post.status || 'unknown';
      console.log(`${index + 1}. ${post.title || 'Untitled'} - 状态: ${status} - 创建时间: ${post.created_at}`);
      
      // 统计状态
      if (status === PostStatus.Created) {
        statusCount[PostStatus.Created]++;
      } else if (status === PostStatus.Deleted) {
        statusCount[PostStatus.Deleted]++;
      } else if (status === PostStatus.Online) {
        statusCount[PostStatus.Online]++;
      } else if (status === PostStatus.Offline) {
        statusCount[PostStatus.Offline]++;
      } else {
        statusCount['other']++;
      }
    });

    console.log('\n=== 状态统计 ===');
    console.log(`Created (已创建): ${statusCount[PostStatus.Created]}`);
    console.log(`Deleted (已删除): ${statusCount[PostStatus.Deleted]}`);
    console.log(`Online (在线): ${statusCount[PostStatus.Online]}`);
    console.log(`Offline (离线): ${statusCount[PostStatus.Offline]}`);
    console.log(`其他状态: ${statusCount['other']}`);

    return {
      total: posts.length,
      posts,
      statusCount
    };

  } catch (error) {
    console.error('检查文章状态时发生错误:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  checkPostStatus()
    .then(() => {
      console.log('\n文章状态检查完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}