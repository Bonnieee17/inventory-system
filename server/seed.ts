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

// Sample products organized by category
const sampleProducts = [
  // Electronics
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship smartphone with advanced camera system and 5G connectivity',
    price: 1299.99,
    quantity: 45,
    category: 'Electronics',
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Premium Apple smartphone with A17 Pro chip and ProMotion display',
    price: 1199.99,
    quantity: 32,
    category: 'Electronics',
  },
  {
    name: 'MacBook Pro 16"',
    description: 'High-performance laptop with M3 Max processor and 48GB RAM',
    price: 3499.99,
    quantity: 12,
    category: 'Electronics',
  },
  {
    name: 'iPad Air 2024',
    description: 'Versatile tablet with M2 processor perfect for work and creativity',
    price: 799.99,
    quantity: 28,
    category: 'Electronics',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life',
    price: 399.99,
    quantity: 67,
    category: 'Electronics',
  },

  // Home & Garden
  {
    name: 'Smart Home Hub',
    description: 'Central control for all smart home devices',
    price: 149.99,
    quantity: 18,
    category: 'Home & Garden',
  },
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Autonomous vacuum with app control and mapping technology',
    price: 599.99,
    quantity: 8,
    category: 'Home & Garden',
  },
  {
    name: 'Smart Thermostat',
    description: 'Energy-efficient temperature control with learning capabilities',
    price: 249.99,
    quantity: 25,
    category: 'Home & Garden',
  },
  {
    name: 'LED Smart Bulbs (4-pack)',
    description: 'Color-changing WiFi bulbs with voice control support',
    price: 89.99,
    quantity: 156,
    category: 'Home & Garden',
  },
  {
    name: 'Outdoor Security Camera',
    description: 'Weather-resistant camera with night vision and motion detection',
    price: 299.99,
    quantity: 14,
    category: 'Home & Garden',
  },

  // Office Supplies
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back chair with lumbar support and adjustable armrests',
    price: 449.99,
    quantity: 9,
    category: 'Office Supplies',
  },
  {
    name: 'Standing Desk Converter',
    description: 'Adjustable height desk converter for sit-stand flexibility',
    price: 299.99,
    quantity: 16,
    category: 'Office Supplies',
  },
  {
    name: 'Wireless Keyboard & Mouse',
    description: 'Combo set with USB receiver and silent keys',
    price: 79.99,
    quantity: 94,
    category: 'Office Supplies',
  },
  {
    name: 'USB-C Hub Multi-port',
    description: '7-in-1 docking station with HDMI and USB 3.0 ports',
    price: 129.99,
    quantity: 43,
    category: 'Office Supplies',
  },
  {
    name: 'Monitor Light Bar',
    description: 'Screen light for reduced eye strain during work',
    price: 179.99,
    quantity: 22,
    category: 'Office Supplies',
  },

  // Fashion & Accessories
  {
    name: 'Designer Messenger Bag',
    description: 'Premium leather messenger bag with laptop compartment',
    price: 199.99,
    quantity: 11,
    category: 'Fashion',
  },
  {
    name: 'Stainless Steel Watch',
    description: 'Classic automatic watch with sapphire crystal',
    price: 299.99,
    quantity: 19,
    category: 'Fashion',
  },
  {
    name: 'Wireless Earbuds Case',
    description: 'Premium protective charging case for earbuds',
    price: 49.99,
    quantity: 213,
    category: 'Fashion',
  },
  {
    name: 'Laptop Backpack Pro',
    description: 'Travel-friendly backpack with USB charging port',
    price: 149.99,
    quantity: 34,
    category: 'Fashion',
  },
  {
    name: 'Screen Protector (10-pack)',
    description: 'Tempered glass screen protector for smartphones',
    price: 29.99,
    quantity: 456,
    category: 'Fashion',
  },

  // Sports & Outdoors
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof outdoor speaker with 360° sound',
    price: 149.99,
    quantity: 56,
    category: 'Sports & Outdoors',
  },
  {
    name: 'Fitness Tracker Watch',
    description: 'Multi-sport tracking smartwatch with heart rate monitor',
    price: 199.99,
    quantity: 38,
    category: 'Sports & Outdoors',
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip exercise mat with carrying strap',
    price: 69.99,
    quantity: 127,
    category: 'Sports & Outdoors',
  },
  {
    name: 'Camping Tent 4-person',
    description: 'Waterproof camping tent with ventilation',
    price: 349.99,
    quantity: 7,
    category: 'Sports & Outdoors',
  },
  {
    name: 'Water Bottle Smart',
    description: 'Temperature-tracking water bottle with LED display',
    price: 89.99,
    quantity: 82,
    category: 'Sports & Outdoors',
  },
];

async function seedProducts() {
  try {
    console.log('\n🌱 Starting product seed...\n');

    // Get first user (created by)
    const { data: users, error: userError } = await supabase.from('users').select('id').limit(1);

    if (userError || !users || users.length === 0) {
      console.error('❌ No users found. Please register a user first.');
      process.exit(1);
    }

    const createdById = users[0].id;
    console.log(`✅ Using user ID: ${createdById}\n`);

    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking for existing products:', checkError);
      process.exit(1);
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Products already exist. Skipping seed.\n');
      process.exit(0);
    }

    // Add created_by to all products
    const productsWithCreator = sampleProducts.map((product) => ({
      ...product,
      created_by: createdById,
    }));

    // Insert products
    const { error: insertError, data: insertedData } = await supabase
      .from('products')
      .insert(productsWithCreator)
      .select();

    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${insertedData?.length || 0} products!\n`);

    // Get category statistics
    const categoryStats = sampleProducts.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('📊 Products by category:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} products`);
    });

    console.log('\n🎉 Seeding complete!\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

seedProducts();
