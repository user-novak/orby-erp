import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Biller } from './biller';

describe('Biller', () => {
  let component: Biller;
  let fixture: ComponentFixture<Biller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Biller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Biller);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
