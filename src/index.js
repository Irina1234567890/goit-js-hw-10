import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info')
}

refs.searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  e.preventDefault();

  clearInput();

  const searchQuery = refs.searchBox.value.trim();
  console.log(searchQuery)
  
  if(searchQuery === ""){
     return (refs.countryList.innerHTML = ''),
      (refs.countryInfo.innerHTML = '')   
  }

  fetchCountries(searchQuery)
  .then(searchCountry)
  .catch(onFetchError)
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function searchCountry(countries) {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (countries.length === 1) {
          refs.countryList.insertAdjacentHTML('beforeend', createCountryList(countries));
          refs.countryInfo.insertAdjacentHTML('beforeend', createCountryCard(countries));
      }
      else if (countries.length >= 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
      else {
          refs.countryList.insertAdjacentHTML('beforeend', createCountryList(countries))
      }
}

function createCountryCard(countries) {
  return countries
  .map(
      ({ capital, population, languages }) => 
              `<ul class="country-info__list">
                  <li class="country-info__item">Capital: ${capital}</li>
                  <li class="country-info__item">Population: ${population}</li>
                  <li class="country-info__item">Languages: ${Object.values(languages).join(', ')}</li>
              </ul>`
  ).join('')
}

function createCountryList(countries) {
  return countries
      .map(({ name, flags }) => 
          `<li class="country-list__item">
          <div class="item-container">
             <img class="country-list__img" src="${flags.svg}" alt="Flag of ${name.official}">
             <h2 class="country-list__name">${name.official}</h2>
          </div>
         </li>`
      ).join('');  
}

function clearInput() {
  refs.countryList.innerHTML = "";
  refs.countryInfo.innerHTML = "";
}


