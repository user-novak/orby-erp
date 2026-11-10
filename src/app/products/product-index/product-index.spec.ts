import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIndex } from './product-index';

describe('ProductIndex', () => {
  let component: ProductIndex;
  let fixture: ComponentFixture<ProductIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
