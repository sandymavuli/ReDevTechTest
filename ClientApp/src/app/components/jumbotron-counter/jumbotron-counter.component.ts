import { Component } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-jumbotron-counter',
  templateUrl: './jumbotron-counter.component.html'
})
export class JumbotronCounterComponent {
  constructor(public counterService: CounterService){}
}
