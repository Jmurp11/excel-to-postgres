import 'dotenv/config';
import { excelToPostgresDb } from './sql';

excelToPostgresDb({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: 'test',
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT, 10)
}, '/Users/jim.murphy/Desktop/2021_Projections.xlsx',
    {
        createDatabase: false,
        createTablesUsingSheetNames: false,
        generateId: false
    });