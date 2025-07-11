export interface Train {
  routeId: string;
  tripId: string;
  stationId: string;
  arrivalTime?: string;
  departureTime?: string;
  direction: string;
  feedSource: string;
  trainId?: string;
  scheduledTrack?: string;
  actualTrack?: string;
  minutesAway?: number;
}