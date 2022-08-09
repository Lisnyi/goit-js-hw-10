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
                inputField.style.outlineColor = "initial"
                renderCountryInfo(countries[0])
                return
            } else if (countries.length > 10) {
                clearInterface()
                inputField.style.outlineColor = "initial"
                Notify.info('Too many matches found. Please enter a more specific name.');
                return
            }
            clearInterface()
            renderCountriesList(countries)
        })
        .catch(error =>{
            clearInterface()
            inputField.style.outlineColor = "red"
            return Notify.failure('Oops, there is no country with that name');})
    } else {
        inputField.style.outlineColor = "initial"
        clearInterface()
    }
}

function renderCountriesList(countries) {
    const markup = countries
      .map(({name: {official}, flags: {svg}}) => {
        return `
            <li>
            <img src="${svg}" alt="Прапор ${official}" width=30>
            <b>${official}</b>
            </li>
        `;
      })
      .join("");
      countryList.innerHTML = markup;
}

function renderCountryInfo({languages, flags: {svg}, name: {common, official}, capital, population}) {
    const languagesList = Object.values(languages).join(', ')
    const markup = `
            <div class="country-title">
                <img src="${svg}" alt="Прапор ${official}" width=48>
                <b>${common}</b>
            </div>
            <p><b>Official name:</b> ${official}</p>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${languagesList}</p>
        `;
      countryInfo.innerHTML = markup;
}

function clearInterface() {
    countryList.innerHTML = ""
    countryInfo.innerHTML = ""
}
