import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://vgbibjwptrmhjthagnmd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYmliandwdHJtaGp0aGFnbm1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI1NjA2OSwiZXhwIjoyMDcwODMyMDY5fQ.tPl4tIT3bzm6ndvinhClT3oDLf5KWbXoPuoIjkDCcmE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 根据文章主题生成合适的图片URL
function generateImageUrl(title: string, content: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  // 根据文章内容关键词匹配合适的图片
  if (lowerTitle.includes('strategy') || lowerContent.includes('strategy')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20strategy%20guide%20with%20magical%20cards%20and%20Disney%20characters%20playing%20solitaire%20in%20enchanted%20castle%20setting&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('character') || lowerContent.includes('character')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20characters%20Mickey%20Mouse%20Minnie%20Mouse%20Donald%20Duck%20playing%20magical%20solitaire%20cards%20in%20colorful%20Disney%20castle%20background&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('level') || lowerContent.includes('level')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20game%20levels%20progression%20magical%20card%20layouts%20with%20sparkling%20effects%20and%20Disney%20castle%20towers&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('tip') || lowerContent.includes('tip')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20gameplay%20tips%20magical%20playing%20cards%20with%20Disney%20fairy%20dust%20sparkles%20and%20enchanted%20forest%20background&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('power') || lowerContent.includes('power')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20magical%20power-ups%20glowing%20cards%20with%20Disney%20magic%20wands%20and%20sparkling%20fairy%20dust%20effects&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('collection') || lowerContent.includes('collection')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20card%20collection%20treasure%20chest%20filled%20with%20magical%20Disney%20themed%20playing%20cards%20and%20golden%20coins&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('event') || lowerContent.includes('event')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20special%20events%20celebration%20with%20Disney%20characters%20fireworks%20and%20magical%20card%20games%20in%20Disney%20park&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('reward') || lowerContent.includes('reward')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20rewards%20treasure%20magical%20gems%20golden%20coins%20and%20Disney%20character%20cards%20with%20sparkling%20effects&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('beginner') || lowerContent.includes('beginner')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20beginner%20guide%20Mickey%20Mouse%20teaching%20card%20game%20basics%20with%20simple%20card%20layouts%20and%20friendly%20Disney%20setting&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('advanced') || lowerContent.includes('advanced')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20advanced%20gameplay%20complex%20magical%20card%20arrangements%20with%20Disney%20sorcerer%20Mickey%20and%20mystical%20castle%20background&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('daily') || lowerContent.includes('daily')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20daily%20challenges%20calendar%20with%20magical%20Disney%20cards%20and%20characters%20celebrating%20daily%20achievements&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('update') || lowerContent.includes('update')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20game%20updates%20new%20features%20magical%20interface%20with%20Disney%20characters%20and%20sparkling%20card%20animations&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('community') || lowerContent.includes('community')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20community%20players%20Disney%20characters%20playing%20together%20sharing%20cards%20in%20magical%20Disney%20village%20setting&image_size=landscape_16_9';
  }
  
  if (lowerTitle.includes('technical') || lowerContent.includes('technical')) {
    return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20technical%20settings%20magical%20control%20panel%20with%20Disney%20themed%20interface%20and%20sparkling%20technical%20elements&image_size=landscape_16_9';
  }
  
  // 默认图片 - 通用Disney Solitaire主题
  return 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Disney%20Solitaire%20magical%20card%20game%20with%20Disney%20castle%20Mickey%20Mouse%20and%20sparkling%20playing%20cards%20in%20enchanted%20fairy%20tale%20setting&image_size=landscape_16_9';
}

async function updatePostImages() {
  try {
    console.log('正在获取所有文章...');
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, content, cover_url')
      .order('id', { ascending: true });

    if (error) {
      console.error('获取文章时出错:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('没有找到文章');
      return;
    }

    console.log(`找到 ${posts.length} 篇文章，开始更新配图...\n`);
    
    let updatedCount = 0;
    
    for (const post of posts) {
      const newImageUrl = generateImageUrl(post.title, post.content);
      
      console.log(`更新文章 ${post.id}: ${post.title}`);
      console.log(`新图片URL: ${newImageUrl}`);
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ cover_url: newImageUrl })
        .eq('id', post.id);

      if (updateError) {
        console.error(`更新文章 ${post.id} 时出错:`, updateError);
      } else {
        updatedCount++;
        console.log(`✅ 文章 ${post.id} 更新成功\n`);
      }
      
      // 添加小延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n=== 更新完成 ===`);
    console.log(`总文章数: ${posts.length}`);
    console.log(`成功更新: ${updatedCount}`);
    console.log(`失败数量: ${posts.length - updatedCount}`);
    
  } catch (error) {
    console.error('执行更新时出错:', error);
  }
}

// 执行更新
updatePostImages();