import { excelToPostgresDb } from './sql';

excelToPostgresDb(
	{
		host: 'localhost',
		user: 'postgres',
		password: 'postgres',
		port: 5432,
		database: 'test',
	},
	'/Users/jim/Documents/workspace/multi-sport-draft-aid/server/data/baseball.xlsx',
	{
		createDatabase: true,
		createTables: true,
	}
).then((t) => console.log(t));
