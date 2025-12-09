import database from "infra/database.js";

async function status(req, res) {
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectiosResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectiosValue = parseInt(
    databaseMaxConnectiosResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpennedConnetionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpennedConnetionsValue =
    databaseOpennedConnetionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectiosValue,
        used_connections: databaseOpennedConnetionsValue,
      },
    },
  });
}

export default status;
