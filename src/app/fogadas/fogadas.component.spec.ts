import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogadasComponent } from './fogadas.component';

describe('FogadasComponent', () => {
  let component: FogadasComponent;
  let fixture: ComponentFixture<FogadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FogadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FogadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
