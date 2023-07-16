import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HostPage } from './host-page.component';

describe('HostPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        HostPage
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HostPage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'airbnb-management'`, () => {
    const fixture = TestBed.createComponent(HostPage);
    const app = fixture.componentInstance;

  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(HostPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('airbnb-management app is running!');
  });
});
