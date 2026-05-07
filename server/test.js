require('dotenv').config();

console.log('Testing Supabase configuration...');

try {
  const { supabase, supabaseAnon } = require('./config/supabase');

  console.log('✓ Supabase clients loaded successfully');
  console.log('✓ Service client initialized');
  console.log('✓ Anon client initialized');

  async function testConnection() {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.log('✗ Error:', error.message);
    } else {
      console.log('✓ Connected to Supabase!');
      console.log(data);
    }
  }

  testConnection();

} catch (error) {
  console.error('✗ Error loading Supabase clients:', error.message);
  process.exit(1);
}