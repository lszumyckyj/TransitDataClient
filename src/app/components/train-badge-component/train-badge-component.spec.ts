import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainBadgeComponent } from './train-badge-component';

describe('TrainBadgeComponent', () => {
  let component: TrainBadgeComponent;
  let fixture: ComponentFixture<TrainBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
