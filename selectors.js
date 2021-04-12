import {createSelector} from 'selectorLibrary';

const getAllCities = (state) => state.cities.byKey;
const getAllCountries = (state) => state.countries.byKey;


/* 	Problém 1:
	Máme komponentu, kterou zajímá vždy jen Atlanta
	Při každém přidání nového města do byKey se ale vždy selektor getCityByKey přepočíta, i když se změna Atlanty netýká.

	Problém 2:
	Vstupy mohou být obecně datově poměrně velké (například složité souřadnice hranic měst).
	Navíc se mohou často měnit (například selektor používá několik komponent najednou a každá pro jiné město).
	Proto není vhodné pro porovnání použít deep equal.
*/
const getCityByKey = createSelector(
	[getAllCities, cityKey => cityKey],
	(cities, cityKey) => {
		return cities[cityKey];
	}
);

/* ----- */
const getAllCityKeysForCountry = createSelector(
	[getAllCountries, countryKey => countryKey],
	(countries, countryKey) => {
		return countries[countryKey].cities;
	}
);


/*	Problém 3:
 	Potřebujeme používat selektor uvnitř jiného selektorů, kvůli znovupoužití a neduplikování kódu.
 	U standardních knihoven by to znamenalo posílat do těla selektoru i state.
*/
const getCitiesOverMilionInhabitansIn2020ByCountryKey = createSelector(
	[getAllCityKeysForCountry],
	(cityKeys) => {
		let filteredCities = [];

		cityKeys.forEach(cityKey => {
			const cityData = getCityByKey(cityKey);
			if (cityData?.attributes?.population?.["2020"] > 1000000) {
				filteredCities.push(cityData);
			}
		});

		return filteredCities;
	}
);