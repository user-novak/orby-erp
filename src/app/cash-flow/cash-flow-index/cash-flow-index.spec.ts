import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowIndex } from './cash-flow-index';

describe('CashFlowIndex', () => {
  let component: CashFlowIndex;
  let fixture: ComponentFixture<CashFlowIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashFlowIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
