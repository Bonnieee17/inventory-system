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

// Specific product images that match each product exactly
const productImages: Record<string, string> = {
  // Electronics - Smartphones and Devices
  'Samsung Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop&q=80',
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop&q=80',
  'MacBook Pro 16"': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80',
  'iPad Air 2024': 'https://images.unsplash.com/photo-1533061802074-9dac3e70aad6?w=400&h=400&fit=crop&q=80',
  'Sony WH-1000XM5 Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',

  // Home & Garden - Smart Home Devices
  'Smart Home Hub': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
  'Robot Vacuum Cleaner': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&q=80',
  'Smart Thermostat': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80',
  'LED Smart Bulbs (4-pack)': 'https://images.unsplash.com/photo-1565636192335-14f9d7648ecf?w=400&h=400&fit=crop&q=80',
  'Outdoor Security Camera': 'https://images.unsplash.com/photo-1568667256549-094345406838?w=400&h=400&fit=crop&q=80',

  // Office Supplies - Furniture and Accessories
  'Ergonomic Office Chair': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80',
  'Standing Desk Converter': 'https://images.unsplash.com/photo-1593642632823-8f7438348567?w=400&h=400&fit=crop&q=80',
  'Wireless Keyboard & Mouse': 'https://images.unsplash.com/photo-1587557998598-9e89204de854?w=400&h=400&fit=crop&q=80',
  'USB-C Hub Multi-port': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop&q=80',
  'Monitor Light Bar': 'https://images.unsplash.com/photo-1515505054-a73e0f3e4b4e?w=400&h=400&fit=crop&q=80',

  // Fashion - Bags, Watches, Accessories
  'Designer Messenger Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
  'Stainless Steel Watch': 'https://images.unsplash.com/photo-1523170335684-f042f1b847c1?w=400&h=400&fit=crop&q=80',
  'Wireless Earbuds Case': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
  'Laptop Backpack Pro': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80',
  'Screen Protector (10-pack)': 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop&q=80',

  // Sports & Outdoors - Equipment
  'Portable Bluetooth Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80',
  'Fitness Tracker Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
  'Yoga Mat Premium': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&q=80',
  'Camping Tent 4-person': 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=400&fit=crop&q=80',
  'Water Bottle Smart': 'https://images.unsplash.com/photo-1602143407151-7111542de6e9?w=400&h=400&fit=crop&q=80',
};

async function addImagesToProducts() {
  try {
    console.log('\n🖼️  Matching product images to names...\n');

    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, category');

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      process.exit(1);
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found.\n');
      process.exit(1);
    }

    console.log(`Found ${products.length} products to update\n`);

    let updated = 0;
    let failed = 0;
    const updates: Array<{ id: string; name: string; category: string; image_url: string }> = [];

    for (const product of products) {
      const imageUrl = productImages[product.name];

      if (!imageUrl) {
        console.log(`⚠️  No image mapping for: ${product.name} (${product.category})`);
        failed++;
        continue;
      }

      updates.push({
        id: product.id,
        name: product.name,
        category: product.category,
        image_url: imageUrl,
      });
    }

    // Batch update all products
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: update.image_url })
          .eq('id', update.id);

        if (updateError) {
          console.log(`❌ Failed to update ${update.name}: ${updateError.message}`);
          failed++;
        } else {
          console.log(`✅ [${update.category}] ${update.name}`);
          updated++;
        }
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n🎉 Product images matched and updated!\n`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addImagesToProducts();
