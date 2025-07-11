import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-train-badge-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './train-badge-component.html',
  styleUrl: './train-badge-component.css'
})
export class TrainBadgeComponent {
  @Input({ required: true }) line!: string;
  @Input() size: 'small' | 'normal' = 'normal';

  getLineColorClass(): string {
    return `line-${this.line}`;
  }
}