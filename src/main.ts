import { excelToPostgresDb } from './sql';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

excelToPostgresDb({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'test',
	port: 5432
}, path.resolve(__dirname, './data/2021_Projections.xlsx'),
{
	createDatabase: true,
	createTables: true
});