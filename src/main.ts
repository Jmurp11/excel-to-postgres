import 'dotenv/config';
import { populateDatabase } from './sql';

populateDatabase({
    user: process.env.USERNAME,
    host: process.env.HOST,
    // database: 'test',
    password: process.env.PASSWORD,
    port: process.env.PORT
}, '/Users/jim.murphy/Desktop/2021_Projections.xlsx',
    {
        createDatabase: true,
        databaseName: 'test',
        createTablesUsingSheetNames: true
    });