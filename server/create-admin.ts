import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdminUser() {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123';

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Try to insert new admin user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: adminEmail,
        name: 'Admin User',
        password_hash: passwordHash,
        role: 'admin',
      })
      .select();

    if (error) {
      if (error.code === '23505') {
        // User already exists, update to admin
        const { data: updateData, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin', password_hash: passwordHash })
          .eq('email', adminEmail)
          .select();

        if (updateError) {
          console.error('❌ Error updating user:', updateError);
          process.exit(1);
        }

        console.log('\n✅ Admin user updated successfully!\n');
      } else {
        console.error('❌ Error creating user:', error);
        process.exit(1);
      }
    } else {
      console.log('\n✅ Admin user created successfully!\n');
    }

    console.log('📧 Admin Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: admin\n`);

    console.log('🔐 Use these credentials to log in to the admin dashboard\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

createAdminUser();
