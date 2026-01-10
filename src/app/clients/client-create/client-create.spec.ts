import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreate } from './client-create';

describe('ClientCreate', () => {
  let component: ClientCreate;
  let fixture: ComponentFixture<ClientCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
