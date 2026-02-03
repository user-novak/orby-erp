import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountIndex } from './account-index';

describe('AccountIndex', () => {
  let component: AccountIndex;
  let fixture: ComponentFixture<AccountIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
