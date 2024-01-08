import {
  checkPrimaryKey,
  formatColumns,
  formatPrimaryKey,
  getColumns,
  getFields,
} from "../etl-processes";
import { columns_multiple_pk, columns_one_pk, etlProcesses } from "./test-data";

describe("ETL processes tests one primary key", () => {
  test("getFields", () => {
    expect(getFields(etlProcesses.sheet_one_pk)).toEqual(
      etlProcesses.fields_one_pk
    );
  });

  test("getColumns", () => {
    expect(getColumns(etlProcesses.fields_one_pk)).toEqual(columns_one_pk);
  });

  test("formatColumns", () => {
    expect(formatColumns(columns_one_pk)).toEqual({
      formattedColumns: [...etlProcesses.formattedColumns],
      primaryKeyIndex: [0],
    });
  });

  test("checkPrimaryKey", () => {
    expect(checkPrimaryKey(columns_one_pk[0].name)).toEqual(true);
  });

  test("formatPrimaryKey", () => {
    expect(
      formatPrimaryKey({
        formattedColumns: etlProcesses.formattedColumns,
        primaryKeyIndex: [0],
      })
    ).toEqual(etlProcesses.formattedColumnsOnePrimaryKey);
  });
});

describe("ETL processes tests multiple primary key", () => {
  test("getFields", () => {
    expect(getFields(etlProcesses.sheet_multiple_pk)).toEqual(
      etlProcesses.fields_multiple_pks
    );
  });

  test("getColumns", () => {
    expect(getColumns(etlProcesses.fields_multiple_pks)).toEqual(
      columns_multiple_pk
    );
  });

  test("formatColumns", () => {
    expect(formatColumns(columns_multiple_pk)).toEqual({
      formattedColumns: [...etlProcesses.formattedColumns_multiple_pk],
      primaryKeyIndex: [0, 1],
    });
  });

  test("checkPrimaryKey", () => {
    expect(checkPrimaryKey(columns_multiple_pk[0].name)).toEqual(true);
  });

  test("formatPrimaryKey", () => {
    expect(
      formatPrimaryKey({
        formattedColumns: etlProcesses.formattedColumns_multiple_pk,
        primaryKeyIndex: [0, 1],
      })
    ).toEqual(etlProcesses.formattedColumnsMultiplePrimaryKeys);
  });
});
