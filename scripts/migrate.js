// Applies db/schema.sql to the live Supabase Postgres instance.
// Safe to re-run (every statement is create-if-not-exists / insert-on-conflict-do-nothing).
// Run with: npm run db:migrate
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const connectionString = process.env.Direct_connection_str;

if (!connectionString) {
  console.error("Missing Direct_connection_str in the environment.");
  console.error("Run with: node --env-file=.env scripts/migrate.js");
  process.exit(1);
}

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    const { rows } = await client.query(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
    );
    console.log(`Migration applied. ${rows.length} tables in public schema:`);
    rows.forEach((r) => console.log(` - ${r.table_name}`));
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
