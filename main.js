let rates = {};

const selectEl = document.getElementById("selectedOne");
const selectElRes = document.getElementById("selectedTwo");

const input = document.getElementById("input");
const result = document.getElementById("result");
const select = document.getElementById("select");
const button = document.getElementById("button");
const tableRates = document.getElementById("table-rates");

const BYN = {
  Cur_OfficialRate: 1,
  Cur_Abbreviation: "BYN",
};

const createOption = (selectElement, currency, index) => {
  const option = document.createElement("option");
  option.value = currency.Cur_OfficialRate;
  option.text = currency.Cur_Abbreviation;
  selectElement.appendChild(option);
  if (currency.Cur_Abbreviation === "USD") {
    selectElement.selectedIndex = index + 1;
  }
  selectEl.selectedIndex = 0;
};

getCurrency();

async function getCurrency() {
  const answer = await fetch(
    "https://www.nbrb.by/api/exrates/rates?periodicity=0"
  );
  const data = await answer.json();

  createOption(selectEl, BYN);
  createOption(selectElRes, BYN);

  data
    .sort((first, second) =>
      first.Cur_Abbreviation.localeCompare(second.Cur_Abbreviation)
    )
    .forEach((element, index) => {
      if (element.Cur_Abbreviation === "RUB") {
        element.Cur_OfficialRate /= 100;
      }
      rates[element.Cur_Abbreviation] = element.Cur_OfficialRate;

      createOption(selectEl, element, index);
      createOption(selectElRes, element, index);
    });
}

input.oninput = function () {
  const optionKey = selectEl.options[selectEl.selectedIndex].text;
  const optionKeyRes = selectElRes.options[selectElRes.selectedIndex].text;
  if (input.value > 0 && optionKeyRes !== "BYN" && optionKey !== "BYN") {
    result.value = (
      (rates[optionKey] / rates[optionKeyRes]) *
      +input.value
    ).toFixed(2);
  } else if (input.value > 0 && optionKeyRes === "BYN") {
    result.value = (rates[optionKey] * +input.value).toFixed(2);
  } else if (input.value > 0 && optionKey === "BYN") {
    result.value = (+input.value / rates[optionKeyRes]).toFixed(2);
  } else {
    result.value = "";
  }
  setTableRates();
};

selectEl.addEventListener("change", function () {
  resetInputs();
});

selectElRes.addEventListener("change", function () {
  resetInputs();
});

button.addEventListener("click", function () {
  const leftSelect = selectEl.options[selectEl.selectedIndex].value;
  const rightSelect = selectElRes.options[selectElRes.selectedIndex].value;
  selectEl.value = rightSelect;
  selectElRes.value = leftSelect;
  preventDupes(selectElRes, selectEl.selectedIndex);
  preventDupes(selectEl, selectElRes.selectedIndex);
  resetInputs();
});

function preventDupes(select, index) {
  let options = select.options,
    len = options.length;
  while (len--) {
    options[len].disabled = false;
  }
  select.options[index].disabled = true;
}

function resetInputs() {
  input.value = "";
  result.value = "";
}

function setTableRates() {
  const exchangeRate = (
    selectEl.options[selectEl.selectedIndex].value /
    selectElRes.options[selectElRes.selectedIndex].value
  ).toFixed(2);
  tableRates.innerText =
    `1.00 ${selectEl.options[selectEl.selectedIndex].text}\n` +
    "Equals\n" +
    `${exchangeRate} ${selectElRes.options[selectElRes.selectedIndex].text}`;
}

selectEl.onchange = function () {
  preventDupes.call(this, selectElRes, this.selectedIndex);
};

selectElRes.onchange = function () {
  preventDupes.call(this, selectEl, this.selectedIndex);
};
