import { excelToPostgresDb } from './sql';

excelToPostgresDb(
	{
		host: 'localhost',
		user: 'postgres',
		password: 'postgres',
		port: 5432,
		database: 'baseballdb',
	},
	'/Users/jim.murphy/Documents/workspace/multi-sport-draft-aid/server/data/baseballdb.xlsx',
	{
		createTables: true,
	}
).then((t) => console.log(t));
