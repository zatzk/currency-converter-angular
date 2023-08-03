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
  date!: Date;

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

    this.date = this.exchangeRateData.date;
  }
  getRateForCurrency(currencyCode: string): number | undefined {
    return this.exchangeRateData.currencyList.find((currency: any) => currency.code === currencyCode);
  }

  convertTimeStampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return `Last updated: ${date.toLocaleDateString('en-US', options)} `
  }

  fetchExchangeRate() {
    this.exchangeService.getExchangeRate()
    .subscribe((currencies) => {
      const date = this.convertTimeStampToDate(currencies.timestamp);
      console.log(date);
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
        date,
        currencyList
      };
      console.log('Fetched exchange rate:', this.exchangeRateData);

    });
  }
}
