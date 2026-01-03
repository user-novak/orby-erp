import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageEdit } from './storage-edit';

describe('StorageEdit', () => {
  let component: StorageEdit;
  let fixture: ComponentFixture<StorageEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
