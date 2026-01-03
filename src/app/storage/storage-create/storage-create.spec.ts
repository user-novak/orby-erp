import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageCreate } from './storage-create';

describe('StorageCreate', () => {
  let component: StorageCreate;
  let fixture: ComponentFixture<StorageCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
