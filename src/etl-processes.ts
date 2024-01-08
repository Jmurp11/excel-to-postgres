export enum SQLType {
  VARCHAR = "VARCHAR",
  BOOLEAN = "BOOLEAN",
  FLOAT = "FLOAT",
  INT = "INT",
}

export enum SQLKeyword {
  PRIMARY_KEY = "PRIMARY KEY",
  NOT_NULL = "NOT NULL",
  SERIAL = "SERIAL",
}
export interface Column {
  name: string;
  type: string;
}

export interface Fields<T> {
  names: string[];
  values: T[];
}

interface FormatColumnsResult {
  formattedColumns: string[];
  primaryKeyIndex: number[];
}

export function getFields<T>(data: T): Fields<T> {
  const names = Object.keys(data);
  const values = Object.values(data);

  return { names, values };
}

export function getColumns<T>(fields: Fields<T>): Column[] {
  return fields.values.map((value: T, index: number) => {
    switch (typeof value) {
      case "string":
        return {
          name: fields.names[index],
          type: SQLType.VARCHAR,
        };
      case "number":
        return {
          name: fields.names[index],
          type: SQLType.FLOAT,
        };
      case "boolean":
        return {
          name: fields.names[index],
          type: SQLType.BOOLEAN,
        };
      default:
        break;
    }
  });
}

export function formatColumns(columns: Column[]): FormatColumnsResult {
  const primaryKeyIndex: number[] = [];

  const formattedColumns: string[] = columns.map((col: Column, index: number) =>
    formatColumn(col, primaryKeyIndex, index)
  );

  return { formattedColumns, primaryKeyIndex: primaryKeyIndex };
}

export function formatColumn(
  col: Column,
  primaryKeyIndex: number[],
  index: number
) {
  const formatted = `${col.name.replace(/\s/g, "")} ${col.type}`;

  if (checkPrimaryKey(col.name)) {
    primaryKeyIndex.push(index);
  }

  return formatted;
}

export function checkPrimaryKey(col: string): boolean {
  const primaryKeyIndicator = "_pk";

  if (
    col.substring(col.length, col.length - 3).toUpperCase() ===
    primaryKeyIndicator.toUpperCase()
  ) {
    return true;
  }

  return false;
}

export function formatPrimaryKey(
  formatColumnsResult: FormatColumnsResult
): string[] {
  if (formatColumnsResult.primaryKeyIndex.length < 1) {
    return formatColumnsResult.formattedColumns;
  }

  if (formatColumnsResult.primaryKeyIndex.length === 1) {
    const primaryColumn = formatColumnsResult.formattedColumns[
      formatColumnsResult.primaryKeyIndex[0]
    ].concat(` ${SQLKeyword.PRIMARY_KEY}`);

    formatColumnsResult.formattedColumns[
      formatColumnsResult.primaryKeyIndex[0]
    ] = primaryColumn;

    return formatColumnsResult.formattedColumns;
  }

  const primaryKeys: string[] = [];

  formatColumnsResult.primaryKeyIndex.forEach((index) => {
    primaryKeys.push(
      formatColumnsResult.formattedColumns[index].substring(
        0,
        formatColumnsResult.formattedColumns[index].indexOf(" ")
      )
    );
  });

  const primaryColumns = `${SQLKeyword.PRIMARY_KEY} (${primaryKeys})`;

  formatColumnsResult.formattedColumns.push(primaryColumns);

  return formatColumnsResult.formattedColumns;
}

export function generatePrimaryKey(
  formatColumnsResult: FormatColumnsResult
): string[] {
  const primaryColumn = `id ${SQLKeyword.SERIAL} ${SQLKeyword.NOT_NULL} ${SQLKeyword.PRIMARY_KEY}`;

  formatColumnsResult.formattedColumns.push(primaryColumn);

  return formatColumnsResult.formattedColumns;
}
