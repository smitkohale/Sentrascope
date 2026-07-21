import postgres from 'postgres';

const sql = postgres('postgresql://postgres:smitkohale%4030@db.viddxevlgrwvljnzhlwx.supabase.co:5432/postgres', {
  max: 1,
  idle_timeout: 10,
  connect_timeout: 15,
  prepare: false,
});

async function test() {
  try {
    const result = await sql`SELECT NOW() as server_time, current_database() as db, version() as ver`;
    console.log('✅ Connected to Supabase PostgreSQL');
    console.log('   Server time:', result[0].server_time);
    console.log('   Database:', result[0].db);
    console.log('   Version:', result[0].ver.split(',')[0]);

    const tables = await sql`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('users', 'alert_settings')
      ORDER BY table_name, ordinal_position
    `;
    
    if (tables.length === 0) {
      console.log('❌ No tables found! Run supabase-init.sql in Supabase SQL Editor');
    } else {
      console.log('\n✅ Tables found:');
      let currentTable = '';
      for (const row of tables) {
        if (row.table_name !== currentTable) {
          console.log('\n   📋 ' + row.table_name + ':');
          currentTable = row.table_name;
        }
        console.log('      - ' + row.column_name + ' (' + row.data_type + ', nullable: ' + row.is_nullable + ')');
      }
    }

    const indexes = await sql`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public' AND tablename IN ('users', 'alert_settings')
    `;
    console.log('\n✅ Indexes:', indexes.length);
    for (const idx of indexes) {
      console.log('   - ' + idx.indexname + ' on ' + idx.tablename);
    }

    const userCount = await sql`SELECT COUNT(*)::int as cnt FROM users`;
    const alertCount = await sql`SELECT COUNT(*)::int as cnt FROM alert_settings`;
    console.log('\n📊 Row counts:');
    console.log('   users:', userCount[0].cnt);
    console.log('   alert_settings:', alertCount[0].cnt);

  } catch (err) {
    console.error('❌ Database error:', err.message);
  } finally {
    await sql.end();
  }
}
test();
