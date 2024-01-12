import {
	createDatabase,
	createTable,
	dropTable,
	handlePrimaryKey,
	insert,
	PrimaryKeyOptions,
} from '../sql';
import { etlProcesses, sqlInfo, sqlResults } from './test-data';

describe('SQL tests', () => {
	test('create database', () => {
		expect(createDatabase(sqlInfo.database)).toEqual(
			sqlResults.createDatabase
		);
	});

	test('create table generate primary key', () => {
		expect(
			createTable(
				sqlInfo.tableName,
				etlProcesses.sheet_one_pk,
				PrimaryKeyOptions.GENERATE
			)
		).toEqual(sqlResults.createTableGeneratedPrimaryKey);
	});

	test('create table one existing primary key', () => {
		expect(
			createTable(
				sqlInfo.tableName,
				etlProcesses.sheet_one_pk,
				PrimaryKeyOptions.USE_EXISTING
			)
		).toEqual(sqlResults.createTableOnePrimaryKey);
	});

	test('drop table', () => {
		expect(dropTable(sqlInfo.tableName)).toEqual(sqlResults.dropTable);
	});

	test('create table multiple existing primary keys', () => {
		expect(
			createTable(
				sqlInfo.tableName,
				etlProcesses.sheet_multiple_pk,
				PrimaryKeyOptions.USE_EXISTING
			)
		).toEqual(sqlResults.createTableMultiplePrimaryKeys);
	});

	test('insert', () => {
		expect(insert(sqlInfo.tableName, [etlProcesses.sheet_one_pk])).toEqual(
			sqlResults.insert
		);
	});

	test('handle primary key options', () => {
		expect(handlePrimaryKey({ generatePrimaryKey: true })).toEqual(
			PrimaryKeyOptions.GENERATE
		);
		expect(handlePrimaryKey({ useExistingPrimaryKeys: true })).toEqual(
			PrimaryKeyOptions.USE_EXISTING
		);
		expect(handlePrimaryKey({})).toEqual(PrimaryKeyOptions.NO_PRIMARY_KEY);
	});
});
