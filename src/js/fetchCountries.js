const BASE_URL = 'https://restcountries.com/v3.1'
const FILTER = 'name,capital,population,flags,languages'

const fetchCountries = (name) => {
    return fetch (`${BASE_URL}/name/${name}/?fields=${FILTER}`).then(response => response.json())
}

export { fetchCountries }