import { Component } from '@angular/core';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  exchangeRateData: any;
  selectedFromCurrency!: string;
  selectedToCurrency!: string;
  amount!: number;
  convertedAmount!: number;

  constructor(private exchangeService: ExchangeService) {
    this.fetchExchangeRate();
   }

  getCurrencySymbol(selectedCurrencyCode: string): string {
    const selectedCurrency = this.exchangeRateData.currencyList.find((currency: { code: string; }) => currency.code === selectedCurrencyCode);
    return selectedCurrency ? selectedCurrency.symbol : '';
  }

  convert() {
    if (!this.exchangeRateData || !this.amount) {
      return;
    }

    const fromRate = this.getRateForCurrency(this.selectedFromCurrency);
    const toRate = this.getRateForCurrency(this.selectedToCurrency);

    if (!fromRate || !toRate) {
      return;
    }

    this.convertedAmount = (this.amount / fromRate) * toRate;
  }
  getRateForCurrency(currencyCode: string): number | undefined {
    return this.exchangeRateData.currencyList.find((currency: any) => currency.code === currencyCode)?.rate;
  }

  fetchExchangeRate() {
    this.exchangeService.getExchangeRate()
    .subscribe((currencies) => {
      const timestamp = currencies.timestamp;

      const currencyList = Object.keys(currencies.rates).map((key) => {
        return {
          code: key,
          name: currencies.rates[key].name,
          rate: currencies.rates[key].rate,
          symbol: currencies.rates[key].symbol,
          emoji: currencies.rates[key].emoji,
        };
      });
      this.exchangeRateData = {
        timestamp,
        currencyList
      };
      console.log('Fetched exchange rate:', this.exchangeRateData);

    });
  }
}
