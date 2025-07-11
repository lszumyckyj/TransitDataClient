import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { TransitRealtimeDataService } from '../../services/transit-realtime-data-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private transitRealtimeDataService = inject(TransitRealtimeDataService);

  lastUpdated = this.transitRealtimeDataService.lastUpdated;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDarkMode();
  }
}
