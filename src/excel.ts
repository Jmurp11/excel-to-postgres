import * as XLSX from 'xlsx';

interface Worksheet<T> {
  title: string;
  data: T[];
}

export function readExcel<T>(file: string): Worksheet<T>[] {
	try {
		const workbook = XLSX.readFile(file);

		const worksheets: Worksheet<T>[] = getWorkSheets(workbook);

		return worksheets;
	} catch (err) {
		console.log(err);
	}
}

function getWorkSheets<T>(workbook: XLSX.WorkBook): Worksheet<T>[] {
	try {
		const worksheets: Worksheet<T>[] = [];

		workbook.SheetNames.forEach((sheetName: string) => {
			worksheets.push({
				title: sheetName,
				data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
			});
		});

		return worksheets;
	} catch (err) {
		console.log(err);
	}
}
