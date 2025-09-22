import { formatCsvFiles, formatExcelFiles, formatJsonFiles } from "@cricket-analysis-monorepo/service";
import { IMatchSheetFormat } from "@cricket-analysis-monorepo/interfaces";
import { IBatsmanStatsData, IBowlerStatsData, TReportDetails, IVenueStatsData, IStatTileItem, ITeamPerformanceData } from "../types-api/src";
import { extname } from "path";
import { FileFormatType } from "@cricket-analysis-monorepo/constants";

export const readExcelFiles = async (
  files: File[]
): Promise<Record<string, string[]>> => {
  const parsedResults: Record<string, IMatchSheetFormat> = {};
  const columnResults: Record<string, string[]> = {};

  for (const file of files) {
    const baseName = file.name;
    const ext = baseName.includes('.') ? extname(baseName) : '';

    try {
      if (ext === FileFormatType.csv) {
        await formatCsvFiles(parsedResults, baseName, file);
      } else if (ext === FileFormatType.json) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const jsonData = JSON.parse(buffer.toString("utf-8"));
        const columns = formatJsonFiles(jsonData as unknown as IMatchSheetFormat);
        columnResults[baseName] = columns;
      } else if (ext === FileFormatType.xlsx) {
        const fileArrayBuffer = await file.arrayBuffer();
        formatExcelFiles(parsedResults, fileArrayBuffer, baseName);
      }

      if (ext !== FileFormatType.json) {
        const fileData = parsedResults[baseName];
        const allColumns = new Set<string>();
        if (Array.isArray(fileData)) {
          const firstItem = fileData[0];
          if (firstItem && typeof firstItem === 'object') {
            Object.keys(firstItem).forEach(key => allColumns.add(key));
          }
        } else if (fileData && typeof fileData === 'object') {
          Object.keys(fileData).forEach(key => allColumns.add(key));
        }
        columnResults[baseName] = Array.from(allColumns);
      }

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

export const createStatTilesGroup = (items: IStatTileItem[] | undefined | null) => {
  if (!items || items.length === 0) {
    return {
      items: [
        {
          title: 'No data available',
          subtext: '',
        },
      ],
    };
  }

  return { items };
}

export const isTeamPerformanceStatsData = (details: TReportDetails): details is ITeamPerformanceData => {
  return 'matches' in details;
};