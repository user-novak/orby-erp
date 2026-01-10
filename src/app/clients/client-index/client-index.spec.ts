import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIndex } from './client-index';

describe('ClientIndex', () => {
  let component: ClientIndex;
  let fixture: ComponentFixture<ClientIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
