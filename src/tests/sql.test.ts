import { createDatabase, createTable, insert } from '../sql';
import { etlProcesses, sqlInfo, sqlResults } from './test-data';

describe('SQL tests', () => {
    test('create database', () => {
        expect(createDatabase(sqlInfo.database)).toEqual(sqlResults.createDatabase);
    });

    test('create table', () => {
        expect(createTable(sqlInfo.tableName, etlProcesses.sheet)).toEqual(sqlResults.createTable);
    });

    test('insert', () => {
        expect(insert(sqlInfo.tableName, [etlProcesses.sheet])).toEqual(sqlResults.insert);
    });
});