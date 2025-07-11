import { Train } from "./train";

export interface ProcessedStation {
  stationId: string;
  stationName: string;
  direction: string;
  trains: Train[];
  lines: string[];
}