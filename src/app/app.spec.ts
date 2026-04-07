import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct page title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const titleService = TestBed.inject(Title);
    expect(titleService.getTitle()).toBe('LMSFrontend');
  });
});
