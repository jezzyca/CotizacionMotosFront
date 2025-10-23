import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionHeaderComponent } from './cotizacion-header.component';

describe('CotizacionHeaderComponent', () => {
  let component: CotizacionHeaderComponent;
  let fixture: ComponentFixture<CotizacionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizacionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
