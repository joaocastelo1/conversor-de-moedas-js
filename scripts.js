const convertButton = document.querySelector('.convert-button')
const currencySelect = document.querySelector('.currency-select')

const currencyData = {
  USD: { name: 'Dólar americano', locale: 'en-US', img: './assets/dolar.png', symbol: 'US$' },
  EUR: { name: 'Euro', locale: 'de-DE', img: './assets/euro.png', symbol: '€' },
  BRL: { name: 'Real', locale: 'pt-BR', img: './assets/real.png', symbol: 'R$' },
  GBP: { name: 'Libra Esterlina', locale: 'en-GB', img: '', symbol: '£' },
  JPY: { name: 'Iene', locale: 'ja-JP', img: '', symbol: '¥' },
  CAD: { name: 'Dólar Canadense', locale: 'en-CA', img: '', symbol: 'C$' },
  AUD: { name: 'Dólar Australiano', locale: 'en-AU', img: '', symbol: 'A$' },
  CHF: { name: 'Franco Suíço', locale: 'de-CH', img: '', symbol: 'Fr' },
  CNY: { name: 'Yuan', locale: 'zh-CN', img: '', symbol: '¥' },
  ARS: { name: 'Peso Argentino', locale: 'es-AR', img: '', symbol: '$' },
}

async function getRate(toCurrency) {
  if (toCurrency === 'BRL') return 1;
  const url = `https://economia.awesomeapi.com.br/last/${toCurrency}-BRL`;
  try {
    const data = await (await fetch(url)).json();
    const key = `${toCurrency}BRL`;
    return parseFloat(data[key].bid);
  } catch (err) {
    alert('Erro ao buscar cotação.');
    return null;
  }
}

async function convertValues() {
  const inputCurrencyValue = parseFloat(document.querySelector('.input-currency').value.replace(/[^0-9,.-]+/g, '').replace(',', '.')) || 0;
  const currencyValueToConvert = document.querySelector('.currency-value-to-convert');
  const currencyValueConverted = document.querySelector('.currency-value');
  const currencyImg = document.getElementById('currency-img');
  const currencyName = document.getElementById('currency-name');
  const toCurrency = currencySelect.value;

  const rate = await getRate(toCurrency);
  if (rate === null) return;

  // Atualiza valores
  currencyValueToConvert.innerHTML = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(inputCurrencyValue);

  let convertedValue;
  if (toCurrency === 'BRL') {
    convertedValue = inputCurrencyValue;
  } else {
    convertedValue = inputCurrencyValue / rate;
  }

  currencyValueConverted.innerHTML = new Intl.NumberFormat(currencyData[toCurrency].locale, {
    style: 'currency',
    currency: toCurrency,
  }).format(convertedValue);

  // Atualiza nome e imagem
  currencyName.innerHTML = currencyData[toCurrency].name;
  if (currencyImg && currencyData[toCurrency].img) {
    currencyImg.src = currencyData[toCurrency].img;
    currencyImg.alt = `logo-moeda-convertida-${toCurrency}`;
  } else if (currencyImg) {
    currencyImg.src = '';
    currencyImg.alt = '';
  }
}

function changeCurrency() {
  const currencyName = document.getElementById('currency-name');
  const currencyImg = document.getElementById('currency-img');
  const toCurrency = currencySelect.value;
  currencyName.innerHTML = currencyData[toCurrency].name;
  if (currencyImg && currencyData[toCurrency].img) {
    currencyImg.src = currencyData[toCurrency].img;
    currencyImg.alt = `logo-moeda-convertida-${toCurrency}`;
  } else if (currencyImg) {
    currencyImg.src = '';
    currencyImg.alt = '';
  }
  convertValues();
}

currencySelect.addEventListener('change', changeCurrency);
convertButton.addEventListener('click', convertValues);
