'use strict'
const ratesURL = 'https://api.exchangerate.host';
var rawCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'CNY'];
var currSelect = document.getElementById('currSelect');
var baseCurrency;

//Exchange Rates

window.onload = function() {
    var select = document.getElementById('currSelect');
    exchange.latest();
    
    select.onchange = function() {
        let tds = document.querySelectorAll('.temp');
    
        if (tds) {
            for (let i = 0; i < tds.length; i++) {
            tds[i].remove();
            }
        }
        if (select) {
            exchange.latest();
        }
    }
};

const exchange = {
    latest: function(baseCurrency = currSelect.value) {
        let currencies = rawCurrencies.filter((c) => {return c != baseCurrency});

        const request = new XMLHttpRequest();
        request.open('GET', `${ratesURL}/latest?base=${baseCurrency}&symbols=${currencies.join(',')}`);
        request.responseType = 'json';
        request.send();

        request.onload = function () {
            const response = request.response;
            const tableBodyCurr = document.getElementById('tr-curr');
            const tableBodyRate = document.getElementById('tr-rate');
            console.log(request.response);

            if (response) {
                for (const [currency, value] of Object.entries(response.rates)) {
                    const tableTdCurr = document.createElement('td');
                    tableTdCurr.classList.add('temp');
                    tableTdCurr.innerHTML = `${currency}`;
                    tableBodyCurr.appendChild(tableTdCurr);
                    
                    const tableTdRate = document.createElement('td');
                    tableTdRate.classList.add('temp');
                    tableTdRate.innerHTML = `${value}`;
                    tableBodyRate.appendChild(tableTdRate);
                }
            }
        }
    }
};

//Calculator

var amountFrom = document.getElementById('amountFrom');
var selectFrom = document.getElementById('selectFrom');
var selectTo = document.getElementById('selectTo');

amountFrom.oninput = function inputSend(fromCurrency = selectFrom.value, toCurrency = selectTo.value, amount = amountFrom.value) {
    const request = new XMLHttpRequest();
    request.open('GET', `${ratesURL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        const response = request.response;
        
        if (response) {
          var amountResult = document.getElementById('amount-result');
          amountResult.value = response.result;
        }
    };
    selectFrom.onchange = function() {
        inputSend();
    };
    selectTo.onchange = function() {
        inputSend();
    };
};

amountFrom.onclick = function() {
    this.value = '', document.getElementById('amount-result').value = '';
};