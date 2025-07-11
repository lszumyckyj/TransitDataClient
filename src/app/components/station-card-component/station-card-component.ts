import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ProcessedStation } from '../../models/processed-station';
import { TrainBadgeComponent } from '../train-badge-component/train-badge-component';
import { normalizeLine } from '../../utils/normalize-line';

@Component({
  selector: 'app-station-card-component',
  standalone: true,
  imports: [TrainBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './station-card-component.html',
  styleUrl: './station-card-component.css'
})
export class StationCardComponent {
  @Input({ required: true }) station!: ProcessedStation;

  get sortedTrains() {
    // Map routeId to normalized value for badge display
    return this.station.trains
      .sort((a, b) => (a.minutesAway || 0) - (b.minutesAway || 0))
      .slice(0, 5)
      .map(train => ({
        ...train,
        routeId: normalizeLine(train.routeId)
      }));
  }

  getDirectionLabel(direction: string): string {
    switch (direction.toLowerCase()) {
      case 'north': return 'Northbound';
      case 'south': return 'Southbound';
      case 'east': return 'Eastbound';
      case 'west': return 'Westbound';
      default: return direction;
    }
  }

  get uniqueNormalizedLines(): string[] {
    // Normalize and deduplicate lines
    const normalized = this.station.lines.map(normalizeLine);
    return Array.from(new Set(normalized));
  }
}
