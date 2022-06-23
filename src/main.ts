import { excelToPostgresDb } from './sql';

const paths = [
	'/Users/jamesmurphy/workspace/excel-to-postgres/src/data/rankings.xlsx',
	'/Users/jamesmurphy/workspace/excel-to-postgres/src/data/hitter_projections.xlsx',
	'/Users/jamesmurphy/workspace/excel-to-postgres/src/data/pitcher_projections.xlsx',
];

paths.forEach((file) =>
	excelToPostgresDb(
		{
			host: 'localhost',
			user: 'jamesmurphy',
			password: 'password',
			port: 5432,
			database: 'fbdraft',
		},
		file,
		{
			createDatabase: false,
			createTables: true,
		}
	)
);
