import { excelToPostgresDb } from "./sql";

const paths = [
  "/Users/jim/Documents/workspace/excel-to-postgres/src/data/rankings.xlsx",
  //   "/Users/jim/Documents/workspace/excel-to-postgres/src/data/hitter_projections.xlsx",
  //   "/Users/jim/Documents/workspace/excel-to-postgres/src/data/pitcher_projections.xlsx",
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
