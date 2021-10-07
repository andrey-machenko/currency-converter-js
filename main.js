const rates = {};
const elementBYN = document.getElementById("BYN");
const elementUSD = document.getElementById("USD");

const input = document.getElementById("input");
const result = document.getElementById("result");
const select = document.getElementById("select");


getCurrency();

async function getCurrency() {
    const answer = await fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0');
    const data = await answer.json();
    rates.USD = data.find(currency => currency.Cur_Abbreviation === "USD");
    elementUSD.textContent = rates.USD.Cur_OfficialRate;
    elementBYN.textContent = (1 / rates.USD.Cur_OfficialRate).toFixed(2);
}

input.oninput = function () {
    if (input.value > 0) {
        const rate = (parseFloat(input.value) / rates.USD.Cur_OfficialRate).toFixed(2);
        result.value = rate;
    } else {
        result.value = "";
    }
}

result.oninput = function () {
    const rate = (parseFloat(result.value) * rates.USD.Cur_OfficialRate).toFixed(2);
    input.value = rate;
}
