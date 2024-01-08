import { excelToPostgresDb } from "./sql";

const paths = [
  "/Users/jim/Documents/workspace/excel-to-postgres/src/data/rankings.csv",
  "/Users/jim/Documents/workspace/excel-to-postgres/src/data/hitter_projections.csv",
  "/Users/jim/Documents/workspace/excel-to-postgres/src/data/pitcher_projections.csv",
];

paths.forEach((file) =>
  excelToPostgresDb(
    {
      host: "localhost",
      user: "postgres",
      password: "postgres",
      port: 5432,
      database: "baseball",
    },
    file,
    {
      createDatabase: false,
      createTables: true,
    }
  )
);
