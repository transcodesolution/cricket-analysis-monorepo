import { stripExt, formatCsvFiles, formatExcelFiles } from "@cricket-analysis-monorepo/service";
import { IMatchSheetFormat } from "@cricket-analysis-monorepo/interfaces";
import { IBatsmanStatsData, IBowlerStatsData, TReportDetails, IVenueStatsData } from "../types-api/src";

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

export const isBatsmanStatsData = (details: TReportDetails): details is IBatsmanStatsData => {
  return 'playerName' in details && 'rpi' in details;
}

export const isBowlerStatsData = (details: TReportDetails): details is IBowlerStatsData => {
  return ('avg' in details && 'deliveryOutcomes' in details);
};

export const isVenueStatsData = (details: TReportDetails): details is IVenueStatsData => {
  return 'venues' in details;
};

export const getScoreColor = (runs: number) => {
  if (runs === 0) return 'var(--mantine-color-red-9)'; // dark red
  if (runs < 10) return 'var(--mantine-color-red-8)'; // red
  if (runs < 30) return 'var(--mantine-color-orange-6)'; // orange
  if (runs < 50) return 'var(--mantine-color-green-8)'; // green
  return 'var(--mantine-color-green-9)'; // dark green
};

export const getFormattedStatValue = (n: number | undefined | null) =>
  !n ? 0 : Number(n).toFixed(1);