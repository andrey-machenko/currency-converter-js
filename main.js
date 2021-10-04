const rates = {};
const elementBYN = document.querySelector('[data-value="BYN"]')
const elementUSD = document.querySelector('[data-value="USD"]')

const input = document.querySelector('#input');
const result = document.querySelector('#result');
const select = document.querySelector('#select');

getCurrency();

async function getCurrency () {
    const answer = await fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0');
    const data = await answer.json();
    rates.USD = data.find( currency => currency.Cur_Abbreviation === "USD")
}

input.oninput = function() {
    const rate = (parseFloat(input.value) / rates.USD.Cur_OfficialRate).toFixed(2);
    result.value = rate;
    elementUSD.textContent = rates.USD.Cur_OfficialRate;
    elementBYN.textContent = (1 / rates.USD.Cur_OfficialRate).toFixed(2);
}

result.oninput = function() {
    const rate = (parseFloat(result.value) * rates.USD.Cur_OfficialRate).toFixed(1);
    input.value = rate;
    elementBYN.textContent = (1 / rates.USD.Cur_OfficialRate).toFixed(2);
    elementUSD.textContent = rates.USD.Cur_OfficialRate;
}



