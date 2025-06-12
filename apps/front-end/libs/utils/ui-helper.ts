import { stripExt, formatCsvFiles, formatExcelFiles } from "@cricket-analysis-monorepo/service";
import { IMatchSheetFormat } from "@cricket-analysis-monorepo/interfaces";
import { IBatsmanStatsData, IReportDetails } from "../types-api/src";

export const readExcelFiles = async (
  files: File[]
): Promise<Record<string, string[]>> => {
  const parsedResults: Record<string, IMatchSheetFormat> = {};
  const columnResults: Record<string, string[]> = {};

  for (const file of files) {
    const baseName = stripExt(file.name);
    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? '' : '';

    try {
      if (ext === 'csv') {
        await formatCsvFiles(parsedResults, baseName, file);
      } else {
        const fileArrayBuffer = await file.arrayBuffer();
        formatExcelFiles(parsedResults, fileArrayBuffer, baseName);
      }
      const fileData = parsedResults[baseName];
      const allColumns = new Set<string>();
      console.log('fileData', fileData);
      if (Array.isArray(fileData)) {
        const firstItem = fileData[0];
        if (firstItem && typeof firstItem === 'object') {
          Object.keys(firstItem).forEach(key => allColumns.add(key));
        }
      } else if (fileData && typeof fileData === 'object') {
        Object.keys(fileData).forEach(key => allColumns.add(key));
      }

      columnResults[baseName] = Array.from(allColumns);
    } catch (err) {
      console.error(`Error reading ${file.name}:`, err);
      columnResults[baseName] = [];
    }
  }

  return columnResults;
};

export const isEquals = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || !obj1 || !obj2) return false;

  const keys1 = Object.keys(obj1 as object);
  const keys2 = Object.keys(obj2 as object);

  if (keys1.length !== keys2.length) return false;

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  return keys1.every((key) => isEquals((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key]));
};

export const getColorByValue = (value: number): string => {
  if (value >= 65) return '#1E88E5';   // Dark Blue
  if (value >= 14) return '#7ec6f7';   // Medium Blue
  return '#BBDEFB';                    // Light Blue
};


export const isBatsmanStatsData = (details: IReportDetails): details is IBatsmanStatsData => {
  return 'playerName' in details && 'rpi' in details;
}

export const getScoreColor = (runs: number) => {
  if (runs === 0) return '#b71c1c'; // dark red
  if (runs < 10) return '#d32f2f'; // red
  if (runs < 30) return '#f57c00'; // orange
  if (runs < 50) return '#388e3c'; // green
  return '#2e7d32'; // dark green
};