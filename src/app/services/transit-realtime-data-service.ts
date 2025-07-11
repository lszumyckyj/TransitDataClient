import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, switchMap, startWith, catchError, of } from 'rxjs';
import { AllRealtimeDataResponse } from '../models/all-realtime-data-response';
import { ProcessedStation } from '../models/processed-station';
import { normalizeLine } from '../utils/normalize-line';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransitRealtimeDataService {
  readonly loading = signal(false);
  private http = inject(HttpClient);
  private readonly API_URL = environment.API_URL;
  private readonly REFRESH_INTERVAL = 30000;

  private readonly dataSignal = toSignal(
    interval(this.REFRESH_INTERVAL).pipe(
      startWith(0),
      switchMap(() => this.fetchData()),
      catchError(error => {
        console.error('Error fetching MTA data:', error);
        return of(null);
      })
    ),
    { initialValue: null }
  );

  readonly lastUpdated = computed(() => {
    const data = this.dataSignal();
    return data ? new Date(data.lastUpdated) : null;
  });

  readonly processedStations = computed(() => {
    const data = this.dataSignal();
    if (!data) return [];
    return this.processStations(data);
  });

  readonly allLines = computed(() => {
    const stations = this.processedStations();
    const lines = new Set<string>();
    stations.forEach(station => station.lines.forEach((line: string) => {
      lines.add(normalizeLine(line));
    }));
    return Array.from(lines).sort();
  });

  private lastProcessedStations: ProcessedStation[] = [];

  constructor() {
    // Using Angular 20's effect for side effects
    effect(() => {
      const data = this.dataSignal();
      if (data) {
        console.log('MTA data updated:', data.lastUpdated);
      }
    });
  }

  private fetchData() {
    this.loading.set(true);

    // For development, use mock data if API fails
    return this.http.get<AllRealtimeDataResponse>(this.API_URL)
      .pipe(
        catchError(error => {
          console.error('Error fetching MTA data:', error);
          console.log('Using mock data for development');
          return of(this.getMockData());
        }),
        switchMap(data => {
          this.loading.set(false);
          return of(data);
        })
      );
  }

  private getMockData(): AllRealtimeDataResponse {
    const now = new Date();
    return {
      lastUpdated: now.toISOString(),
      trains: [
        // Times Square trains
        { routeId: "1", tripId: "1001", stationId: "127N", arrivalTime: this.addMinutes(now, 2), minutesAway: 2, direction: "North", feedSource: "1", trainId: "1A" },
        { routeId: "1", tripId: "1002", stationId: "127S", arrivalTime: this.addMinutes(now, 5), minutesAway: 5, direction: "South", feedSource: "1", trainId: "1B" },
        { routeId: "N", tripId: "N001", stationId: "127N", arrivalTime: this.addMinutes(now, 3), minutesAway: 3, direction: "North", feedSource: "NQR", trainId: "NA", scheduledTrack: "1" },
        { routeId: "Q", tripId: "Q001", stationId: "127S", arrivalTime: this.addMinutes(now, 1), minutesAway: 1, direction: "South", feedSource: "NQR", trainId: "QA", actualTrack: "4" },
        { routeId: "7", tripId: "7001", stationId: "127N", arrivalTime: this.addMinutes(now, 4), minutesAway: 4, direction: "North", feedSource: "7" },

        // Grand Central trains
        { routeId: "4", tripId: "4001", stationId: "628N", arrivalTime: this.addMinutes(now, 1), minutesAway: 1, direction: "North", feedSource: "456" },
        { routeId: "5", tripId: "5001", stationId: "628S", arrivalTime: this.addMinutes(now, 3), minutesAway: 3, direction: "South", feedSource: "456" },
        { routeId: "6", tripId: "6001", stationId: "628N", arrivalTime: this.addMinutes(now, 2), minutesAway: 2, direction: "North", feedSource: "456", scheduledTrack: "2" },

        // Union Square trains
        { routeId: "L", tripId: "L001", stationId: "635N", arrivalTime: this.addMinutes(now, 2), minutesAway: 2, direction: "North", feedSource: "L" },
        { routeId: "L", tripId: "L002", stationId: "635S", arrivalTime: this.addMinutes(now, 4), minutesAway: 4, direction: "South", feedSource: "L" },
        { routeId: "N", tripId: "N002", stationId: "635S", arrivalTime: this.addMinutes(now, 3), minutesAway: 3, direction: "South", feedSource: "NQR" },
        { routeId: "4", tripId: "4002", stationId: "635N", arrivalTime: this.addMinutes(now, 5), minutesAway: 5, direction: "North", feedSource: "456" }
      ],
      stations: [
        { stationId: "127N", stationName: "Times Square - 42 St", direction: "North" },
        { stationId: "127S", stationName: "Times Square - 42 St", direction: "South" },
        { stationId: "628N", stationName: "Grand Central - 42 St", direction: "North" },
        { stationId: "628S", stationName: "Grand Central - 42 St", direction: "South" },
        { stationId: "635N", stationName: "Union Square - 14 St", direction: "North" },
        { stationId: "635S", stationName: "Union Square - 14 St", direction: "South" }
      ],
      totalTrains: 12,
      totalStations: 6
    };
  }

  private addMinutes(date: Date, minutes: number): string {
    return new Date(date.getTime() + minutes * 60000).toISOString();
  }

  private processStations(data: AllRealtimeDataResponse): ProcessedStation[] {
    const stationMap = new Map<string, ProcessedStation>();
    const prevStationMap = new Map<string, ProcessedStation>();
    this.lastProcessedStations.forEach(station => {
      const key = `${station.stationId}-${station.stationName}-${station.direction}`;
      prevStationMap.set(key, station);
    });

    // Create station entries
    data.stations.forEach(station => {
      const stationId = normalizeLine(station.stationId);
      const key = `${stationId}-${station.stationName}-${station.direction}`;
      let processedStation = prevStationMap.get(key);
      if (!processedStation) {
        processedStation = {
          stationId: stationId,
          stationName: station.stationName,
          direction: station.direction,
          trains: [],
          lines: []
        };
      } else {
        // Clear trains and lines for reuse
        processedStation.trains = [];
        processedStation.lines = [];
      }
      stationMap.set(key, processedStation);
    });

    // Add trains to stations
    data.trains.forEach(train => {
      const station = data.stations.find(s => s.stationId === train.stationId);
      if (
        station &&
        train.minutesAway !== undefined &&
        train.minutesAway !== null &&
        train.minutesAway >= 0
      ) {
        const stationId = normalizeLine(station.stationId);
        const key = `${stationId}-${station.stationName}-${station.direction}`;
        const processedStation = stationMap.get(key);
        if (processedStation) {
          // Try to reuse previous train object if possible
          let prevTrain = processedStation.trains.find(t => t.tripId === train.tripId && t.trainId === train.trainId);
          if (!prevTrain) {
            prevTrain = { ...train };
          } else {
            Object.assign(prevTrain, train);
          }
          processedStation.trains.push(prevTrain);
          const normalizedRouteId = normalizeLine(train.routeId);
          if (!processedStation.lines.includes(normalizedRouteId)) {
            processedStation.lines.push(normalizedRouteId);
          }
        }
      }
    });

    const result = Array.from(stationMap.values())
      .filter(station => station.trains.length > 0)
      .map(station => ({
        ...station,
        lines: station.lines.sort()
      }));

    // Update the cache for next time
    this.lastProcessedStations = result;
    return result;
  }

  refresh() {
    // Force a refresh by re-fetching data
    this.fetchData().subscribe();
  }
}
