import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyProductImages() {
  try {
    console.log('\n📸 Verifying product images...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, image_url, category')
      .order('category');

    if (error) {
      console.error('❌ Error fetching products:', error);
      process.exit(1);
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found');
      process.exit(1);
    }

    const withImages = products.filter(p => p.image_url);
    const withoutImages = products.filter(p => !p.image_url);

    console.log(`📊 Product Summary:`);
    console.log(`   Total Products: ${products.length}`);
    console.log(`   ✅ With Images: ${withImages.length}`);
    console.log(`   ❌ Without Images: ${withoutImages.length}\n`);

    if (withoutImages.length > 0) {
      console.log('⚠️  Products missing images:');
      withoutImages.forEach((p) => {
        console.log(`   - ${p.name} (${p.category})`);
      });
    } else {
      console.log('✅ ALL PRODUCTS HAVE IMAGES!\n');
    }

    // Group by category
    const byCategory = products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {} as Record<string, typeof products>);

    console.log('📁 Products by Category:\n');
    Object.entries(byCategory).forEach(([category, items]) => {
      const hasImages = items.filter(i => i.image_url).length;
      console.log(`   ${category}: ${hasImages}/${items.length} with images`);
      items.forEach(item => {
        const status = item.image_url ? '✅' : '❌';
        console.log(`      ${status} ${item.name}`);
      });
      console.log();
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

verifyProductImages();
