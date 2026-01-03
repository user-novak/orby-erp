import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageIndex } from './storage-index';

describe('StorageIndex', () => {
  let component: StorageIndex;
  let fixture: ComponentFixture<StorageIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
