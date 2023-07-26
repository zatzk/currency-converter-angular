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
  remainingDecimal!: number;
  exchangeFromName!: string;
  exchangeToName!: string;

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

    const fromRate: any = this.getRateForCurrency(this.selectedFromCurrency);
    const toRate: any = this.getRateForCurrency(this.selectedToCurrency);

    if (!fromRate || !toRate) {
      return;
    }

    this.exchangeFromName = fromRate.name;
    this.exchangeToName = toRate.name;

    const conversionAmount = (this.amount / fromRate.rate) * toRate.rate;
    this.convertedAmount = Number(conversionAmount.toFixed(2));

    const fractional = (conversionAmount - Math.floor(conversionAmount));
    this.remainingDecimal = Number(fractional.toString().substring(4).slice(0, 4));

  }
  getRateForCurrency(currencyCode: string): number | undefined {
    return this.exchangeRateData.currencyList.find((currency: any) => currency.code === currencyCode);
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
