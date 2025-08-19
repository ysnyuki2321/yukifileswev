import { readFile } from "fs/promises"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const { Client } = require("pg")

async function run() {
  const connectionString = process.env.DB_URL
  if (!connectionString) {
    console.error("DB_URL is required. Example: DB_URL=postgresql://user:pass@host:5432/postgres pnpm migrate:db")
    process.exit(1)
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log("Connected to database")

  const files = [
    "scripts/01-create-database-schema.sql",
    "scripts/02-auth-columns.sql",
    "scripts/03-plans-and-flags.sql",
    "scripts/04-seed-demo-user.sql",
  ]

  for (const file of files) {
    const sql = await readFile(file, "utf8")
    console.log(`\nApplying: ${file}`)
    try {
      await client.query(sql)
      console.log(`Applied: ${file}`)
    } catch (e) {
      console.error(`Failed: ${file}`, e.message)
    }
  }

  await client.end()
  console.log("Done.")
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

