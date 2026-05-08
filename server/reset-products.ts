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

async function resetProducts() {
  try {
    console.log('\n🗑️  Clearing all existing products...\n');

    // Delete all products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error deleting products:', deleteError);
      process.exit(1);
    }

    console.log('✅ All products deleted\n');

    // Get first user for created_by
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error('❌ No users found');
      process.exit(1);
    }

    const createdById = users[0].id;

    // New 10 products with exact images
    const newProducts = [
      {
        name: 'Wireless Keyboard',
        description: 'Professional wireless keyboard with quiet keys and long battery life',
        price: 79.99,
        quantity: 150,
        category: 'Office Equipment',
        image_url: 'https://images.unsplash.com/photo-1587557998598-9e89204de854?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Optical Mouse',
        description: 'High precision optical mouse with ergonomic design',
        price: 49.99,
        quantity: 200,
        category: 'Office Equipment',
        image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Stylus Pen',
        description: 'Digital stylus pen for tablets and touch devices with pressure sensitivity',
        price: 89.99,
        quantity: 85,
        category: 'Digital Accessories',
        image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Portable Mini Sound Speaker',
        description: 'Compact wireless speaker with powerful bass and 8 hours battery',
        price: 59.99,
        quantity: 120,
        category: 'Audio Equipment',
        image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'USB-C Cable',
        description: 'Fast charging USB-C cable with 100W power delivery support',
        price: 19.99,
        quantity: 500,
        category: 'Cables & Connectors',
        image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for improved ergonomics',
        price: 39.99,
        quantity: 90,
        category: 'Office Equipment',
        image_url: 'https://images.unsplash.com/photo-1593642632823-8f7438348567?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Screen Protector',
        description: 'Tempered glass screen protector for smartphones - pack of 3',
        price: 14.99,
        quantity: 400,
        category: 'Digital Accessories',
        image_url: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Monitor Lamp',
        description: 'LED monitor light bar for reduced eye strain and better lighting',
        price: 44.99,
        quantity: 75,
        category: 'Office Equipment',
        image_url: 'https://images.unsplash.com/photo-1515505054-a73e0f3e4b4e?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Webcam HD',
        description: '1080p HD webcam with auto focus and built-in microphone',
        price: 79.99,
        quantity: 110,
        category: 'Digital Accessories',
        image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'Phone Holder',
        description: 'Adjustable phone holder for desk with stable base',
        price: 24.99,
        quantity: 300,
        category: 'Mobile Accessories',
        image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a8a07af7?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
    ];

    // Insert new products
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(newProducts)
      .select();

    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      process.exit(1);
    }

    console.log(`✅ Successfully created 10 new products!\n`);

    // Group by category
    const byCategory = newProducts.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p.name);
      return acc;
    }, {} as Record<string, string[]>);

    console.log('📁 Products by Category:\n');
    Object.entries(byCategory).forEach(([category, items]) => {
      console.log(`   ${category}:`);
      items.forEach(item => {
        console.log(`      ✅ ${item}`);
      });
    });

    console.log(`\n🎉 Product reset complete! Total: ${insertedProducts?.length || 0} products\n`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

resetProducts();
