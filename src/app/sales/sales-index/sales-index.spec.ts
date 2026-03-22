import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesIndex } from './sales-index';

describe('SalesIndex', () => {
  let component: SalesIndex;
  let fixture: ComponentFixture<SalesIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
