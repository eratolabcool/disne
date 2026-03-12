import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateArticlesStatus() {
  try {
    console.log('🔍 Checking current article statuses...');
    
    // First, get all articles and their current status
    const { data: articles, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, status')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching articles:', fetchError);
      return;
    }
    
    if (!articles || articles.length === 0) {
      console.log('📝 No articles found in database.');
      return;
    }
    
    console.log(`📊 Found ${articles.length} articles:`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - Status: ${article.status}`);
    });
    
    // Filter articles that are not already published
    const articlesToUpdate = articles.filter(article => article.status !== 'published');
    
    if (articlesToUpdate.length === 0) {
      console.log('✅ All articles are already published!');
      return;
    }
    
    console.log(`\n🔄 Found ${articlesToUpdate.length} articles to update to 'published' status:`);
    articlesToUpdate.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - Current: ${article.status}`);
    });
    
    // Ask for confirmation (in a real scenario, you might want to add readline for interactive confirmation)
    console.log('\n⚠️  This will update all non-published articles to "published" status.');
    console.log('Proceeding with batch update...');
    
    // Perform batch update
    const articleIds = articlesToUpdate.map(article => article.id);
    
    const { data: updatedArticles, error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published',
        updated_at: new Date().toISOString()
      })
      .in('id', articleIds)
      .select('id, title, status');
    
    if (updateError) {
      console.error('❌ Error updating articles:', updateError);
      return;
    }
    
    console.log(`\n✅ Successfully updated ${updatedArticles?.length || 0} articles to 'online' status:`);
    updatedArticles?.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} - New Status: ${article.status}`);
    });
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyArticles, error: verifyError } = await supabase
      .from('posts')
      .select('id, title, status')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }
    
    const onlineCount = verifyArticles?.filter(article => article.status === 'online').length || 0;
    const totalCount = verifyArticles?.length || 0;
    
    console.log(`📈 Final status: ${onlineCount}/${totalCount} articles are now online`);
    
    if (onlineCount === totalCount) {
      console.log('🎉 All articles are now successfully online!');
    } else {
      console.log('⚠️  Some articles may still need attention.');
      const nonOnlineArticles = verifyArticles?.filter(article => article.status !== 'online') || [];
      nonOnlineArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} - Status: ${article.status}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Add delay function for rate limiting
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Execute the function
if (require.main === module) {
  console.log('🚀 Starting article status update process...');
  updateArticlesStatus()
    .then(() => {
      console.log('\n✨ Article status update process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Process failed:', error);
      process.exit(1);
    });
}

export { updateArticlesStatus };