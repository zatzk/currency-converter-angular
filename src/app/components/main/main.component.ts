import { Component } from '@angular/core';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private exchangeService: ExchangeService) {
    this.fetchExchangeRate();
   }

  fetchExchangeRate() {
    this.exchangeService.getExchangeRate()
    .subscribe((currencies) => {
      console.log(currencies);
    });
  }
}
