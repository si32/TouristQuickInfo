const OXILOR_API_KEY='-yY-uX_pqjH0feej_0050WXLxd_pcM'


document.addEventListener("DOMContentLoaded", function() {

    let add_location_link = document.querySelector('#add_location_link');

    add_location_link.addEventListener('click', () => {
        console.log('start get contries');

        get_countries();

        let countries = document.querySelector('#countries')
        countries.addEventListener('change', () => {
            cities.disabled = false;
            cities.value = "";
            let cities_list = document.querySelector('#cities_list');
            cities_list.innerHTML = '';


            // put country in form
            let country = countries.value
            fetch(`https://data-api.oxilor.com/rest/search-regions?searchTerm=${country}&&type=country`, {
                headers: {
                    'Authorization': `Bearer ${OXILOR_API_KEY}`,
                    'Accept-Language': 'en'
                },
                method: 'GET'
            })
            .then(response => response.json())
            .then(data_arr => {
                let data = data_arr[0];
                document.querySelector('#country_code').value = data.countryCode;
                document.querySelector('#country_latitude').value = data.latitude;
                document.querySelector('#country_longitude').value = data.longitude;
                document.querySelector('#country_population').value = data.population;
            })

        })

        // cities
        let cities = document.querySelector('#cities');
        cities.addEventListener('keyup', () => {
            let search_text = cities.value;
            let option = countries.options[countries.selectedIndex];
            let countrycode = option.dataset.countrycode;
            let submit_btm = document.querySelector('#add_location_btn');
            submit_btm.disabled = true;
            document.querySelector('#cities').style.color = 'black';

            if (search_text.length >= 2) {
                fetch(`https://data-api.oxilor.com/rest/search-regions?searchTerm=${search_text}&countryCode=${countrycode}&type=city`, {
                    headers: {
                        'Authorization': `Bearer ${OXILOR_API_KEY}`,
                        'Accept-Language': 'en'
                    },
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    let cities_list = document.querySelector('#cities_list');
                    cities_list.innerHTML = '';

                    if (data.length == 0) {
                        document.querySelector('#cities').style.color = 'red';
                        submit_btm.disabled = true;

                    } else {
                        for (let city of data) {
                            let city_name = document.createElement('option');
                            city_name.value = city.name;
                            cities_list.appendChild(city_name);
                            // Register if city in database
                            if (search_text === city.name) {
                                submit_btm.disabled = false;
                                document.querySelector('#city_timezone').value = city.timezone;
                                document.querySelector('#city_latitude').value = city.latitude;
                                document.querySelector('#city_longitude').value = city.longitude;
                                document.querySelector('#city_population').value = city.population;
                            }
                        }
                    }

                })
            }
        })

        let cities_input = document.querySelector('#cities')
        cities_input.addEventListener('click', () => {
            if (cities_input.value == '') {
                cities_input.style.color = 'black';
            }
        })

    });

})


// clear modal form
document.addEventListener("hide.bs.modal", function() {

    let options = document.querySelectorAll('option');
    for (let option of options) {
        option.remove();
    }
    // Create first option for good looking form
    let option = document.createElement('option');
    let country_options = document.querySelector('#countries');
   // set option attributes
    Object.assign(option, {
        'value': "",
        'disabled': true,
        'selected': true,
        'hidden': true
    })
    option.innerHTML = 'Country';
    country_options.appendChild(option);
    // Clear city input
    document.querySelector('#cities').value = '';

})


// Get list of all contries to select
function get_countries() {
    fetch('https://data-api.oxilor.com/rest/countries', {
        headers: {
            'Authorization': `Bearer ${OXILOR_API_KEY}`,
            'Accept-Language': 'en'
        },
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        let select = document.querySelector('#countries');
        for (let obj of data) {
            let country = document.createElement('option');
            // country.value = `${obj.name}`.toLowerCase();
            country.value = `${obj.name}`;
            country.setAttribute('data-countrycode', obj.countryCode);
            country.innerHTML = `${obj.name}`;
            select.appendChild(country);
        }
    })
}


// utils functions
function capitalizeFirstLetter(string) {
       return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
