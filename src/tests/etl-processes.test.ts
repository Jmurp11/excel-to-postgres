import { getFields, getColumns, formatColumns } from '../etl-processes';
import { columns, etlProcesses } from './test-data';

describe('ETL processes tests', () => {
	test('getFields', () => {
		expect(getFields(etlProcesses.sheet)).toEqual(etlProcesses.fields);
	});

	test('getColumns', () => {
		expect(getColumns(etlProcesses.fields)).toEqual(columns);
	});

	test('formatColumns', () => {
		expect(formatColumns(columns)).toEqual(etlProcesses.formattedColumns);
	});
});