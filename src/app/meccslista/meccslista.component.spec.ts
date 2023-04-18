import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeccslistaComponent } from './meccslista.component';

describe('MeccslistaComponent', () => {
  let component: MeccslistaComponent;
  let fixture: ComponentFixture<MeccslistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeccslistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeccslistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
