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

async function addNewProducts() {
  try {
    console.log('\n📦 Adding new products...\n');

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

    // New products to add
    const newProducts = [
      {
        name: 'Low Stock Tumbler',
        description: 'Insulated stainless steel tumbler with lid, keeps drinks hot/cold for hours',
        price: 34.99,
        quantity: 8,
        category: 'Drinkware',
        image_url: 'https://images.unsplash.com/photo-1577937927185-34e6d8b89550?w=400&h=400&fit=crop&q=80',
        created_by: createdById,
      },
      {
        name: 'USB Adapter',
        description: 'Universal USB adapter for charging multiple devices simultaneously',
        price: 29.99,
        quantity: 180,
        category: 'Cables & Connectors',
        image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop&q=80',
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

    console.log(`✅ Successfully added ${insertedProducts?.length || 0} new products!\n`);

    console.log('📝 Products Added:\n');
    newProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: ₱${product.price}`);
      console.log(`   Quantity: ${product.quantity}`);
      if (product.quantity <= 10) {
        console.log(`   ⚠️ LOW STOCK`);
      }
      console.log('');
    });

    console.log('🎉 Products added successfully!\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addNewProducts();
