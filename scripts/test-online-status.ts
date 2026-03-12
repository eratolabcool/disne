import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testOnlineStatus() {
  console.log('🧪 Testing online status functionality...');
  
  try {
    // First, get a sample post to test with
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, status')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Error fetching posts:', fetchError);
      return;
    }
    
    if (!posts || posts.length === 0) {
      console.log('⚠️ No posts found to test with');
      return;
    }
    
    const testPost = posts[0];
    console.log(`📝 Testing with post: "${testPost.title}" (ID: ${testPost.id})`);
    console.log(`📊 Current status: ${testPost.status}`);
    
    // Test updating to 'online' status
    console.log('\n🔄 Attempting to update status to "online"...');
    const { data: updateData, error: updateError } = await supabase
      .from('posts')
      .update({ status: 'online' })
      .eq('id', testPost.id)
      .select('id, title, status');
    
    if (updateError) {
      console.error('❌ Error updating post status:', updateError);
      return;
    }
    
    if (updateData && updateData.length > 0) {
      console.log('✅ Successfully updated post status to "online"!');
      console.log(`📊 New status: ${updateData[0].status}`);
    }
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('posts')
      .select('id, title, status')
      .eq('id', testPost.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }
    
    if (verifyData.status === 'online') {
      console.log('✅ Verification successful! Post status is now "online"');
    } else {
      console.log(`⚠️ Verification failed. Expected "online", got "${verifyData.status}"`);
    }
    
    // Restore original status
    console.log('\n🔄 Restoring original status...');
    const { error: restoreError } = await supabase
      .from('posts')
      .update({ status: testPost.status })
      .eq('id', testPost.id);
    
    if (restoreError) {
      console.error('❌ Error restoring original status:', restoreError);
    } else {
      console.log(`✅ Successfully restored original status: ${testPost.status}`);
    }
    
    console.log('\n🎉 Online status test completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error during test:', error);
  }
}

// Run the test
testOnlineStatus().then(() => {
  console.log('\n✨ Test script finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});