// backend/test-db.js
import "dotenv/config";
import { createClient } from '@supabase/supabase-js';

console.log("🔍 Testing Supabase Database Connection\n");
console.log("=" .repeat(50));

// Check environment variables
console.log("\n📋 Environment Variables Check:");
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? "✅ " + process.env.SUPABASE_URL : "❌ MISSING"}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set (length: " + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ")" : "❌ MISSING"}`);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("\n❌ Missing required environment variables!");
  process.exit(1);
}

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test functions
async function runTests() {
  console.log("\n🔌 Testing Connection...");
  
  // Test 1: Basic connection
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log("✅ Basic connection successful");
  } catch (error) {
    console.error("❌ Basic connection failed:", error.message);
    return;
  }
  
  // Test 2: List all tables
  console.log("\n📊 Checking Tables:");
  try {
    const { data: tables, error } = await supabase
      .rpc('get_tables');
    
    if (error) {
      // Alternative query if function doesn't exist
      const { data: altTables, error: altError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (altError) throw altError;
      console.log("Tables found:", altTables?.map(t => t.table_name).join(", ") || "None");
    } else {
      console.log("Tables found:", tables?.join(", ") || "None");
    }
  } catch (error) {
    console.error("Could not fetch tables:", error.message);
  }
  
  // Test 3: Check users table structure
  console.log("\n👥 Users Table Check:");
  try {
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'users' });
    
    if (error) {
      console.log("Could not fetch columns:", error.message);
    } else {
      console.log("Users table columns:", columns);
    }
  } catch (error) {
    // Try direct query
    try {
      const { data: sample, error: sampleError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (sampleError) throw sampleError;
      console.log("Users table exists. Sample data:", sample);
    } catch (error) {
      console.log("Users table:", error.message);
    }
  }
  
  // Test 4: Try to create a test record
  console.log("\n✍️ Write Test:");
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: testEmail,
          full_name: "Test User",
          username: `testuser_${Date.now()}`
        }
      ])
      .select();
    
    if (error) throw error;
    console.log("✅ Write successful. Created user:", data);
    
    // Clean up - delete test user
    if (data && data[0]) {
      await supabase.from('users').delete().eq('id', data[0].id);
      console.log("✅ Test user cleaned up");
    }
  } catch (error) {
    console.error("❌ Write failed:", error.message);
  }
  
  // Test 5: Check RLS policies
  console.log("\n🔒 RLS Check:");
  try {
    const { data, error } = await supabase
      .rpc('check_rls_enabled');
    
    if (error) {
      console.log("Could not check RLS:", error.message);
    } else {
      console.log("RLS Status:", data);
    }
  } catch (error) {
    console.log("RLS check not available");
  }
  
  console.log("\n" + "=" .repeat(50));
  console.log("✅ Tests completed");
}

// Run tests
runTests().catch(console.error);