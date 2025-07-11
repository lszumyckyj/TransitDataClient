import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransitRealtimeDataService } from '../../services/transit-realtime-data-service';
import { StationCardComponent } from '../station-card-component/station-card-component';
import { SearchFilterComponent } from '../search-filter-component/search-filter-component';

@Component({
  selector: 'app-station-list-component',
  standalone: true,
  imports: [FormsModule, StationCardComponent, SearchFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './station-list-component.html',
  styleUrl: './station-list-component.css'
})
export class StationListComponent {
  private transitRealtimeDataService = inject(TransitRealtimeDataService);

  // Signals for reactive state
  searchTerm = signal('');
  selectedLine = signal('');
  selectedDirection = signal('');

  // Computed signals from service
  allStations = this.transitRealtimeDataService.processedStations;
  allLines = this.transitRealtimeDataService.allLines;
  loading = this.transitRealtimeDataService.loading;

  // Computed filtered stations
  filteredStations = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const line = this.selectedLine();
    const direction = this.selectedDirection();

    return this.allStations().filter(station => {
      const matchesSearch = !search || station.stationName.toLowerCase().includes(search);
      let matchesLine = true;
      if (line) {
        if (line === 'S') {
          matchesLine = station.lines.some(l => l === 'S' || l === 'FS' || l === 'GS' || l === 'H');
        } else {
          matchesLine = station.lines.includes(line);
        }
      }
      const matchesDirection = !direction || station.direction === direction;

      return matchesSearch && matchesLine && matchesDirection;
    });
  });

  refresh() {
    this.transitRealtimeDataService.refresh();
  }
}
