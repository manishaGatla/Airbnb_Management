import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminPage } from './admin-page.component';

describe('AdminPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AdminPage
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AdminPage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'airbnb-management'`, () => {
    const fixture = TestBed.createComponent(AdminPage);
    const app = fixture.componentInstance;

  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AdminPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('airbnb-management app is running!');
  });
});
