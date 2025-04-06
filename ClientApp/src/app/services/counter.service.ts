import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private countKey = 'keyCounter';
  private countSub = new BehaviorSubject<number>(this.loadInitialCount());
  public counter$ = this.countSub.asObservable();

  constructor() {}

  private loadInitialCount(): number {
    const existingCount = sessionStorage.getItem(this.countKey);
    return existingCount ? parseInt(existingCount, 10) : 0;
  }

  incrementCounter() {
    this.saveCount(this.countSub.value + 1);
  }

  private saveCount(value: number) {
    this.countSub.next(value);
    sessionStorage.setItem(this.countKey, value.toString());
  }
}
