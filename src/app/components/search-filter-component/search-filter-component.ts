import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter-component',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-filter-component.html',
  styleUrl: './search-filter-component.css'
})
export class SearchFilterComponent {
  @Input() allLines: string[] = [];
  @Output() searchChange = new EventEmitter<string>();
  @Output() lineFilterChange = new EventEmitter<string>();
  @Output() directionFilterChange = new EventEmitter<string>();
  @Output() refreshClick = new EventEmitter<void>();

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onLineFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.lineFilterChange.emit(value);
  }

  onDirectionFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.directionFilterChange.emit(value);
  }
}