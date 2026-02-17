import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSnackbar } from './notification-snackbar';

describe('NotificationSnackbar', () => {
  let component: NotificationSnackbar;
  let fixture: ComponentFixture<NotificationSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSnackbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
