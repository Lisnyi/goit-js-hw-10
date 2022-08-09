import './css/styles.css';
import { fetchCountries } from './js/fetchCountries'
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputField = document.querySelector("#search-box")
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")

inputField.addEventListener ("input", debounce(getInputValue, DEBOUNCE_DELAY))

function getInputValue (e) {
    let inputValue = e.target.value.trim()
    if (inputValue) {
        fetchCountries(inputValue)
        .then(countries => {
            if (countries.length < 2) {
                clearInterface()
                renderCountryInfo(countries[0])
                return
            } else if (countries.length > 10) {
                clearInterface()
                Notify.info('Too many matches found. Please enter a more specific name.');
                return
            }
            clearInterface()
            renderCountriesList(countries)
        })
        .catch(error =>{
            clearInterface() 
            return Notify.failure('Oops, there is no country with that name');})
    } else {
        clearInterface()
    }
}

function renderCountriesList(countries) {
    const markup = countries
      .map(({name, flags}) => {
        return `
            <li>
            <img src="${flags.svg}" alt="Прапор ${name.official}" width=30>
            <p>${name.official}</p>
            </li>
        `;
      })
      .join("");
      countryList.innerHTML = markup;
}

function renderCountryInfo({languages, flags, name, capital, population}) {
    const languagesList = Object.values(languages).join(', ')
    const markup = `
            <img src="${flags.svg}" alt="Прапор ${name.official}" width=30>
            <p>${name.official}</p>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${languagesList}</p>
        `;
      countryInfo.innerHTML = markup;
}

function clearInterface() {
    countryList.innerHTML = ""
    countryInfo.innerHTML = ""
}
