import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { CounterService } from 'src/app/services/counter.service';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let counterService: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent],
      providers: [CounterService],
    }).compileComponents();

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    counterService = TestBed.inject(CounterService);
    fixture.detectChanges();
  });

  it('should display a title', () => {
    const titleText = fixture.nativeElement.querySelector('h1').textContent;
    expect(titleText).toEqual('Counter');
  });

  it('should start with count 0, then increments by 1 when clicked', fakeAsync(() => {
    const countElement = fixture.nativeElement.querySelector('strong');
    expect(countElement.textContent).toEqual('0');

    const incrementButton = fixture.nativeElement.querySelector('button');
    incrementButton.click();

    tick(); //wait for observable
    fixture.detectChanges();

    expect(countElement.textContent).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledWith('keyCounter', '1');
  }));

  it('should increment the count correctly on repeated clicks', fakeAsync(() => {
    //AAA - Arrange
    const countElement = fixture.nativeElement.querySelector('strong');
    expect(countElement.textContent).toEqual('0');
  
    const incrementButton = fixture.nativeElement.querySelector('button');
  
    // act 
    incrementButton.click();
    tick();
    fixture.detectChanges();
  
    incrementButton.click();
    tick();
    fixture.detectChanges();
  
    incrementButton.click();
    tick();
    fixture.detectChanges();
  
    expect(countElement.textContent).toEqual('3');
  
    //Assert
    expect(localStorage.setItem).toHaveBeenCalledWith('keyCounter', '1');
    expect(localStorage.setItem).toHaveBeenCalledWith('keyCounter', '2');
    expect(localStorage.setItem).toHaveBeenCalledWith('keyCounter', '3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
  }));

});
