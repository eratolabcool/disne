import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updatePostsToOnline() {
  console.log('🔄 Batch Update Posts Status to "online"');
  console.log('=' .repeat(50));
  
  try {
    // First, get all posts that are not already 'online'
    console.log('📊 Fetching posts that are not "online"...');
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, status')
      .neq('status', 'online')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching posts:', fetchError);
      return;
    }
    
    if (!posts || posts.length === 0) {
      console.log('✅ All posts are already "online" or no posts found.');
      return;
    }
    
    console.log(`\n📝 Found ${posts.length} posts that can be updated to "online":`);
    console.log('-'.repeat(50));
    
    posts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" (Status: ${post.status})`);
    });
    
    console.log('-'.repeat(50));
    
    // Ask for confirmation
    const confirmation = await askQuestion('\n❓ Do you want to update all these posts to "online" status? (yes/no): ');
    
    if (confirmation.toLowerCase() !== 'yes' && confirmation.toLowerCase() !== 'y') {
      console.log('❌ Operation cancelled by user.');
      return;
    }
    
    // Update posts in batches
    console.log('\n🔄 Updating posts to "online" status...');
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      const batchIds = batch.map(post => post.id);
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(posts.length / batchSize)} (${batch.length} posts)...`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('posts')
        .update({ status: 'online', updated_at: new Date().toISOString() })
        .in('id', batchIds)
        .select('id, title, status');
      
      if (updateError) {
        console.error(`❌ Error updating batch ${Math.floor(i / batchSize) + 1}:`, updateError);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully updated ${updateData?.length || 0} posts in batch ${Math.floor(i / batchSize) + 1}`);
        successCount += updateData?.length || 0;
      }
      
      // Add a small delay between batches to avoid overwhelming the database
      if (i + batchSize < posts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n📊 Update Summary:');
    console.log('=' .repeat(30));
    console.log(`✅ Successfully updated: ${successCount} posts`);
    console.log(`❌ Failed to update: ${errorCount} posts`);
    console.log(`📝 Total processed: ${posts.length} posts`);
    
    if (successCount > 0) {
      console.log('\n🔍 Verifying updates...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('posts')
        .select('id, title, status')
        .eq('status', 'online')
        .order('updated_at', { ascending: false });
      
      if (verifyError) {
        console.error('❌ Error verifying updates:', verifyError);
      } else {
        console.log(`✅ Verification complete: ${verifyData?.length || 0} posts now have "online" status`);
      }
    }
    
    console.log('\n🎉 Batch update operation completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error during batch update:', error);
  } finally {
    rl.close();
  }
}

// Run the update script
updatePostsToOnline().then(() => {
  console.log('\n✨ Update script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Update script failed:', error);
  rl.close();
  process.exit(1);
});