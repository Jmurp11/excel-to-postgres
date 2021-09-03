import { createDatabase, createTable, insert } from '../sql';
import { etlProcesses, sqlInfo, sqlResults } from './test-data';

describe('SQL tests', () => {
	test('create database', () => {
		expect(createDatabase(sqlInfo.database)).toEqual(sqlResults.createDatabase);
	});

	test('create table one primary key', () => {
		expect(createTable(sqlInfo.tableName, etlProcesses.sheet_one_pk, true)).toEqual(sqlResults.createTableOnePrimaryKey);
	});

	test('create table multiple primary key', () => {
		expect(createTable(sqlInfo.tableName, etlProcesses.sheet_multiple_pk, true)).toEqual(sqlResults.createTableMultiplePrimaryKeys);
	});

	test('insert', () => {
		expect(insert(sqlInfo.tableName, [etlProcesses.sheet_one_pk])).toEqual(sqlResults.insert);
	});
});