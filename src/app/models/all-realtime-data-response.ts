import { Station } from "./station";
import { Train } from "./train";

export interface AllRealtimeDataResponse {
  lastUpdated: string;
  trains: Train[];
  stations: Station[];
  totalTrains: number;
  totalStations: number;
}