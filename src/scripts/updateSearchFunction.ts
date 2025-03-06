import { supabase } from '../lib/supabase';
import * as fs from 'fs/promises';
import * as path from 'path';

async function updateSearchFunction() {
  try {
    // Read the search function SQL
    const sqlPath = path.join(process.cwd(), 'src', 'lib', 'db', 'search_function.sql');
    const sql = await fs.readFile(sqlPath, 'utf-8');

    // Execute the SQL directly
    const { error } = await supabase.from('_raw_sql').rpc('', { sql });
    
    if (error) {
      console.error('Error updating search function:', error);
      throw error;
    }

    console.log('Search function updated successfully');
  } catch (error) {
    console.error('Failed to update search function:', error);
    process.exit(1);
  }
}

updateSearchFunction(); 